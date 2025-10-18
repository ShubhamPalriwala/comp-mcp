import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  ReadResourceRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { APIService } from './services/api.js';
import { TryCompConfig, MCPResponse } from './types/index.js';
import { SERVER_INFO } from './config/constants.js';
import { TOOL_DEFINITIONS } from './config/tools.js';
import { RESOURCES, RESOURCE_CONTENT } from './config/resources.js';
import { PROMPTS, PROMPT_HANDLERS } from './config/prompts.js';
import { validateInput } from './validation/validator.js';
import * as schemas from './validation/schemas.js';

// Import all handlers
import { OrganizationHandlers } from './handlers/organization.js';
import { PeopleHandlers } from './handlers/people.js';
import { RiskHandlers } from './handlers/risks.js';
import { VendorHandlers } from './handlers/vendors.js';
import { TaskHandlers } from './handlers/tasks.js';
import {
  ContextHandlers,
  DeviceHandlers,
  PolicyHandlers,
  CommentHandlers,
  AttachmentHandlers,
  DeviceAgentHandlers,
  HealthHandlers,
  AutomationHandlers,
  TrustPortalHandlers,
} from './handlers/index.js';
import { CompositeHandlers } from './handlers/composite.js';

export class TryCompMCPServer {
  private server: Server;
  private config: TryCompConfig;
  private apiService: APIService;

  // Handler instances
  private organizationHandlers!: OrganizationHandlers;
  private peopleHandlers!: PeopleHandlers;
  private riskHandlers!: RiskHandlers;
  private vendorHandlers!: VendorHandlers;
  private taskHandlers!: TaskHandlers;
  private contextHandlers!: ContextHandlers;
  private deviceHandlers!: DeviceHandlers;
  private policyHandlers!: PolicyHandlers;
  private commentHandlers!: CommentHandlers;
  private attachmentHandlers!: AttachmentHandlers;
  private deviceAgentHandlers!: DeviceAgentHandlers;
  private healthHandlers!: HealthHandlers;
  private automationHandlers!: AutomationHandlers;
  private trustPortalHandlers!: TrustPortalHandlers;
  private compositeHandlers!: CompositeHandlers;

  constructor() {
    // Load configuration from environment variables
    this.config = {
      apiKey: process.env.TRYCOMP_API_KEY,
      organizationId: process.env.TRYCOMP_ORG_ID,
    };

    this.server = new Server(SERVER_INFO, {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    });

    this.apiService = new APIService(this.config);
    this.initializeHandlers();
    this.setupRequestHandlers();
  }

  private initializeHandlers(): void {
    this.organizationHandlers = new OrganizationHandlers(this.apiService);
    this.peopleHandlers = new PeopleHandlers(this.apiService);
    this.riskHandlers = new RiskHandlers(this.apiService);
    this.vendorHandlers = new VendorHandlers(this.apiService);
    this.taskHandlers = new TaskHandlers(this.apiService);
    this.contextHandlers = new ContextHandlers(this.apiService);
    this.deviceHandlers = new DeviceHandlers(this.apiService);
    this.policyHandlers = new PolicyHandlers(this.apiService);
    this.commentHandlers = new CommentHandlers(this.apiService);
    this.attachmentHandlers = new AttachmentHandlers(this.apiService);
    this.deviceAgentHandlers = new DeviceAgentHandlers(this.apiService);
    this.healthHandlers = new HealthHandlers(this.apiService);
    this.automationHandlers = new AutomationHandlers(this.apiService);
    this.trustPortalHandlers = new TrustPortalHandlers(this.apiService);
    this.compositeHandlers = new CompositeHandlers(this.apiService);
  }

  private setupRequestHandlers(): void {
    // Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOL_DEFINITIONS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.handleToolCall(name, args);
        return result;
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });

    // Resources - combine dynamic API resources with static template resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        // Dynamic resources from API
        {
          uri: 'comp://risks',
          name: 'Organizational Risks',
          description: 'List of all risks in the organization',
          mimeType: 'application/json',
        },
        {
          uri: 'comp://vendors',
          name: 'Vendors',
          description: 'List of all vendors',
          mimeType: 'application/json',
        },
        {
          uri: 'comp://policies',
          name: 'Policies',
          description: 'List of all organizational policies',
          mimeType: 'application/json',
        },
        {
          uri: 'comp://tasks',
          name: 'Tasks',
          description: 'List of all tasks',
          mimeType: 'application/json',
        },
        {
          uri: 'comp://devices',
          name: 'Devices',
          description: 'List of all devices in the organization',
          mimeType: 'application/json',
        },
        // Static template and framework resources
        ...RESOURCES,
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        return await this.handleResourceRead(uri);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });

    // Prompts - use the new enhanced prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: PROMPTS.map(p => ({
        name: p.name,
        description: p.description,
        arguments: p.arguments,
      })),
    }));

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        return await this.handlePromptGet(name, args);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });
  }

  private async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case 'configure-trycomp':
        validateInput(schemas.ConfigureTryCompSchema, args);
        return await this.configureTryComp(args);

      // Organization
      case 'get-organization-information':
        validateInput(schemas.OrganizationIdSchema, args);
        return await this.organizationHandlers.getOrganizationInformation(args);
      case 'update-organization':
        validateInput(schemas.UpdateOrganizationSchema, args);
        return await this.organizationHandlers.updateOrganization(args);
      case 'delete-organization':
        validateInput(schemas.OrganizationIdSchema, args);
        return await this.organizationHandlers.deleteOrganization(args);

      // People
      case 'get-all-people':
        validateInput(schemas.GetAllPeopleSchema, args);
        return await this.peopleHandlers.getAllPeople(args);
      case 'create-member':
        validateInput(schemas.CreateMemberSchema, args);
        return await this.peopleHandlers.createMember(args);
      case 'get-person-by-id':
        validateInput(schemas.PersonIdSchema, args);
        return await this.peopleHandlers.getPersonById(args);
      case 'update-member':
        validateInput(schemas.UpdateMemberSchema, args);
        return await this.peopleHandlers.updateMember(args);
      case 'delete-member':
        validateInput(schemas.MemberIdSchema, args);
        return await this.peopleHandlers.deleteMember(args);
      case 'add-multiple-members':
        validateInput(schemas.AddMultipleMembersSchema, args);
        return await this.peopleHandlers.addMultipleMembers(args);

      // Risks
      case 'get-all-risks':
        validateInput(schemas.GetAllRisksSchema, args);
        return await this.riskHandlers.getAllRisks(args);
      case 'create-risk':
        validateInput(schemas.CreateRiskSchema, args);
        return await this.riskHandlers.createRisk(args);
      case 'get-risk-by-id':
        validateInput(schemas.RiskIdSchema, args);
        return await this.riskHandlers.getRiskById(args);
      case 'update-risk':
        validateInput(schemas.UpdateRiskSchema, args);
        return await this.riskHandlers.updateRisk(args);
      case 'delete-risk':
        validateInput(schemas.RiskIdSchema, args);
        return await this.riskHandlers.deleteRisk(args);

      // Vendors
      case 'get-all-vendors':
        validateInput(schemas.GetAllVendorsSchema, args);
        return await this.vendorHandlers.getAllVendors(args);
      case 'create-vendor':
        validateInput(schemas.CreateVendorSchema, args);
        return await this.vendorHandlers.createVendor(args);
      case 'get-vendor-by-id':
        validateInput(schemas.VendorIdSchema, args);
        return await this.vendorHandlers.getVendorById(args);
      case 'update-vendor':
        validateInput(schemas.UpdateVendorSchema, args);
        return await this.vendorHandlers.updateVendor(args);
      case 'delete-vendor':
        validateInput(schemas.VendorIdSchema, args);
        return await this.vendorHandlers.deleteVendor(args);

      // Context
      case 'get-all-context-entries':
        validateInput(schemas.GetAllContextEntriesSchema, args);
        return await this.contextHandlers.getAllContextEntries(args);
      case 'create-context-entry':
        validateInput(schemas.CreateContextEntrySchema, args);
        return await this.contextHandlers.createContextEntry(args);
      case 'get-context-entry-by-id':
        validateInput(schemas.ContextIdSchema, args);
        return await this.contextHandlers.getContextEntryById(args);
      case 'update-context-entry':
        validateInput(schemas.UpdateContextEntrySchema, args);
        return await this.contextHandlers.updateContextEntry(args);
      case 'delete-context-entry':
        validateInput(schemas.ContextIdSchema, args);
        return await this.contextHandlers.deleteContextEntry(args);

      // Devices
      case 'get-all-devices':
        validateInput(schemas.GetAllDevicesSchema, args);
        return await this.deviceHandlers.getAllDevices(args);
      case 'get-devices-by-member-id':
        validateInput(schemas.GetDevicesByMemberIdSchema, args);
        return await this.deviceHandlers.getDevicesByMemberId(args);

      // Policies
      case 'get-all-policies':
        validateInput(schemas.GetAllPoliciesSchema, args);
        return await this.policyHandlers.getAllPolicies(args);
      case 'create-policy':
        validateInput(schemas.CreatePolicySchema, args);
        return await this.policyHandlers.createPolicy(args);
      case 'get-policy-by-id':
        validateInput(schemas.PolicyIdSchema, args);
        return await this.policyHandlers.getPolicyById(args);
      case 'update-policy':
        validateInput(schemas.UpdatePolicySchema, args);
        return await this.policyHandlers.updatePolicy(args);
      case 'delete-policy':
        validateInput(schemas.PolicyIdSchema, args);
        return await this.policyHandlers.deletePolicy(args);

      // Tasks
      case 'get-all-tasks':
        validateInput(schemas.GetAllTasksSchema, args);
        return await this.taskHandlers.getAllTasks(args);
      case 'get-task-by-id':
        validateInput(schemas.TaskIdSchema, args);
        return await this.taskHandlers.getTaskById(args);
      case 'get-task-attachments':
        validateInput(schemas.TaskIdSchema, args);
        return await this.taskHandlers.getTaskAttachments(args);
      case 'upload-attachment-to-task':
        validateInput(schemas.UploadAttachmentToTaskSchema, args);
        return await this.taskHandlers.uploadAttachmentToTask(args);
      case 'get-task-attachment-download-url':
        validateInput(schemas.GetTaskAttachmentDownloadUrlSchema, args);
        return await this.taskHandlers.getTaskAttachmentDownloadUrl(args);
      case 'delete-task-attachment':
        validateInput(schemas.DeleteTaskAttachmentSchema, args);
        return await this.taskHandlers.deleteTaskAttachment(args);

      // Comments
      case 'get-comments-for-entity':
        validateInput(schemas.GetCommentsForEntitySchema, args);
        return await this.commentHandlers.getCommentsForEntity(args);
      case 'create-comment':
        validateInput(schemas.CreateCommentSchema, args);
        return await this.commentHandlers.createComment(args);
      case 'update-comment':
        validateInput(schemas.UpdateCommentSchema, args);
        return await this.commentHandlers.updateComment(args);
      case 'delete-comment':
        validateInput(schemas.CommentIdSchema, args);
        return await this.commentHandlers.deleteComment(args);

      // Attachments
      case 'get-attachment-download-url':
        validateInput(schemas.AttachmentIdSchema, args);
        return await this.attachmentHandlers.getAttachmentDownloadUrl(args);

      // Device Agent
      case 'download-macos-device-agent':
        validateInput(schemas.DownloadDeviceAgentSchema, args);
        return await this.deviceAgentHandlers.downloadMacosDeviceAgent(args);
      case 'download-windows-device-agent':
        validateInput(schemas.DownloadDeviceAgentSchema, args);
        return await this.deviceAgentHandlers.downloadWindowsDeviceAgent(args);

      // Health
      case 'health-check':
        return await this.healthHandlers.healthCheck();

      // Task Automations
      case 'get-all-automations-for-task':
        validateInput(schemas.TaskIdSchema, args);
        return await this.automationHandlers.getAllAutomationsForTask(args);
      case 'create-evidence-automation':
        validateInput(schemas.TaskIdSchema, args);
        return await this.automationHandlers.createEvidenceAutomation(args);
      case 'get-automation-details':
        return await this.automationHandlers.getAutomationDetails(args);
      case 'delete-automation':
        return await this.automationHandlers.deleteAutomation(args);
      case 'get-all-automation-runs':
        validateInput(schemas.TaskIdSchema, args);
        return await this.automationHandlers.getAllAutomationRuns(args);

      // Trust Portal
      case 'get-domain-verification-status':
        return await this.trustPortalHandlers.getDomainVerificationStatus(args);

      // Composite Tools
      case 'manage-risk-lifecycle':
        return await this.compositeHandlers.manageRiskLifecycle(args);
      case 'create-vendor-compliance-package':
        return await this.compositeHandlers.createVendorCompliancePackage(args);
      case 'implement-policy-with-tasks':
        return await this.compositeHandlers.implementPolicyWithTasks(args);
      case 'setup-evidence-collection':
        return await this.compositeHandlers.setupEvidenceCollection(args);
      case 'conduct-vendor-risk-review':
        return await this.compositeHandlers.conductVendorRiskReview(args);

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  }

  private async configureTryComp(args: any): Promise<any> {
    const { apiKey, organizationId } = args;

    // Runtime configuration overrides environment variables
    if (apiKey) this.config.apiKey = apiKey;
    if (organizationId !== undefined) this.config.organizationId = organizationId;

    this.apiService.updateConfig(this.config);

    const configSource = process.env.TRYCOMP_API_KEY && !apiKey
      ? 'environment variables'
      : 'runtime configuration';

    return {
      content: [
        {
          type: 'text',
          text: `TryComp configuration updated successfully!\nConfiguration source: ${configSource}\nAPI Key: ${this.config.apiKey ? 'Set' : 'Not set'}\nOrganization ID: ${this.config.organizationId || 'Not set'}`,
        },
      ],
    };
  }

  private async handleResourceRead(uri: string): Promise<any> {
    // Check if this is a static template resource
    if (RESOURCE_CONTENT[uri]) {
      const content = await RESOURCE_CONTENT[uri]();
      const resource = RESOURCES.find(r => r.uri === uri);
      return {
        contents: [{
          uri,
          mimeType: resource?.mimeType || 'text/plain',
          text: content,
        }]
      };
    }

    // For dynamic API resources, require organization ID
    if (!this.config.organizationId) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Organization ID is required. Configure it using TRYCOMP_ORG_ID environment variable or configure-trycomp tool.'
      );
    }

    const match = uri.match(/^comp:\/\/([^\/]+)(?:\/(.+))?$/);
    if (!match) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid resource URI: ${uri}`);
    }

    const [, resourceType, resourceId] = match;

    switch (resourceType) {
      case 'risks':
        if (resourceId) {
          const result = await this.riskHandlers.getRiskById({ riskId: resourceId });
          return { contents: [{ uri, mimeType: 'application/json', ...result.content[0] }] };
        }
        const risks = await this.riskHandlers.getAllRisks({ organizationId: this.config.organizationId });
        return { contents: [{ uri, mimeType: 'application/json', ...risks.content[0] }] };

      case 'vendors':
        if (resourceId) {
          const result = await this.vendorHandlers.getVendorById({ vendorId: resourceId });
          return { contents: [{ uri, mimeType: 'application/json', ...result.content[0] }] };
        }
        const vendors = await this.vendorHandlers.getAllVendors({ organizationId: this.config.organizationId });
        return { contents: [{ uri, mimeType: 'application/json', ...vendors.content[0] }] };

      case 'policies':
        if (resourceId) {
          const result = await this.policyHandlers.getPolicyById({ policyId: resourceId });
          return { contents: [{ uri, mimeType: 'application/json', ...result.content[0] }] };
        }
        const policies = await this.policyHandlers.getAllPolicies({ organizationId: this.config.organizationId });
        return { contents: [{ uri, mimeType: 'application/json', ...policies.content[0] }] };

      case 'tasks':
        if (resourceId) {
          const result = await this.taskHandlers.getTaskById({ taskId: resourceId });
          return { contents: [{ uri, mimeType: 'application/json', ...result.content[0] }] };
        }
        const tasks = await this.taskHandlers.getAllTasks({ organizationId: this.config.organizationId });
        return { contents: [{ uri, mimeType: 'application/json', ...tasks.content[0] }] };

      case 'devices':
        const devices = await this.deviceHandlers.getAllDevices({ organizationId: this.config.organizationId });
        return { contents: [{ uri, mimeType: 'application/json', ...devices.content[0] }] };

      default:
        throw new McpError(ErrorCode.InvalidParams, `Unknown resource type: ${resourceType}`);
    }
  }

  private async handlePromptGet(name: string, args: Record<string, string> | undefined): Promise<any> {
    // Use the new prompt handlers if available
    const handler = PROMPT_HANDLERS[name];
    if (handler) {
      const promptText = handler(args || {});
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: promptText,
            },
          },
        ],
      };
    }

    // Fallback to old prompts for backward compatibility
    switch (name) {
      case 'vendor-risk-assessment':
        if (!args?.vendorId) {
          throw new McpError(ErrorCode.InvalidParams, 'vendorId is required');
        }
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Please conduct a comprehensive risk assessment for vendor ID: ${args.vendorId}.

Include the following in your assessment:
1. Vendor information and contact details
2. Current risk status and severity level
3. Identified vulnerabilities or concerns
4. Inherent risk scores (probability and impact)
5. Residual risk scores after controls
6. Recommended mitigation strategies
7. Suggested action items and timeline

Use the get-vendor-by-id tool to retrieve vendor details, then analyze the data and provide a structured risk assessment report.`,
              },
            },
          ],
        };

      case 'compliance-report':
        if (!this.config.organizationId) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Organization ID is required. Configure it using TRYCOMP_ORG_ID environment variable or configure-trycomp tool.'
          );
        }
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Generate a comprehensive compliance report for organization ID: ${this.config.organizationId}.

The report should include:
1. **Policy Overview**: List all active policies with their types and status
2. **Risk Analysis**: Summary of all risks categorized by severity (critical, high, medium, low)
3. **Compliance Gaps**: Identify areas where policies may be missing or risks are not adequately addressed
4. **Recommendations**: Prioritized list of actions to improve compliance posture
5. **Risk Treatment**: Overview of treatment strategies being employed

Use the comp://policies and comp://risks resources to gather the necessary data, then create a well-structured report.`,
              },
            },
          ],
        };

      case 'security-task-review':
        if (!this.config.organizationId) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Organization ID is required. Configure it using TRYCOMP_ORG_ID environment variable or configure-trycomp tool.'
          );
        }
        const priority = args?.priority;
        const priorityFilter = priority ? ` with priority: ${priority}` : '';
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Review open security tasks${priorityFilter} for organization ID: ${this.config.organizationId}.

Please provide:
1. **Task Summary**: Total count of open tasks, grouped by status and priority
2. **High Priority Items**: List tasks that require immediate attention
3. **Overdue Tasks**: Identify any tasks past their due date
4. **Resource Allocation**: Show which team members have the most assigned tasks
5. **Recommendations**: Suggest task prioritization and resource reallocation if needed

Use the get-all-tasks tool${priority ? ` with status filter` : ''} to retrieve task information, then analyze and present the findings.`,
              },
            },
          ],
        };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
    }
  }


  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}