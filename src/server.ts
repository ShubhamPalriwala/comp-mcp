import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { APIService } from './services/api.js';
import { TryCompConfig, MCPResponse } from './types/index.js';
import { SERVER_INFO } from './config/constants.js';
import { TOOL_DEFINITIONS } from './config/tools.js';

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
} from './handlers/index.js';

export class TryCompMCPServer {
  private server: Server;
  private config: TryCompConfig = {};
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

  constructor() {
    this.server = new Server(SERVER_INFO, {
      capabilities: { tools: {} },
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
  }

  private setupRequestHandlers(): void {
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
  }

  private async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case 'configure-trycomp':
        return await this.configureTryComp(args);

      // Organization
      case 'get-organization-information':
        return await this.organizationHandlers.getOrganizationInformation(args);
      case 'update-organization':
        return await this.organizationHandlers.updateOrganization(args);
      case 'delete-organization':
        return await this.organizationHandlers.deleteOrganization(args);

      // People
      case 'get-all-people':
        return await this.peopleHandlers.getAllPeople(args);
      case 'create-member':
        return await this.peopleHandlers.createMember(args);
      case 'get-person-by-id':
        return await this.peopleHandlers.getPersonById(args);
      case 'update-member':
        return await this.peopleHandlers.updateMember(args);
      case 'delete-member':
        return await this.peopleHandlers.deleteMember(args);
      case 'add-multiple-members':
        return await this.peopleHandlers.addMultipleMembers(args);

      // Risks
      case 'get-all-risks':
        return await this.riskHandlers.getAllRisks(args);
      case 'create-risk':
        return await this.riskHandlers.createRisk(args);
      case 'get-risk-by-id':
        return await this.riskHandlers.getRiskById(args);
      case 'update-risk':
        return await this.riskHandlers.updateRisk(args);
      case 'delete-risk':
        return await this.riskHandlers.deleteRisk(args);

      // Vendors
      case 'get-all-vendors':
        return await this.vendorHandlers.getAllVendors(args);
      case 'create-vendor':
        return await this.vendorHandlers.createVendor(args);
      case 'get-vendor-by-id':
        return await this.vendorHandlers.getVendorById(args);
      case 'update-vendor':
        return await this.vendorHandlers.updateVendor(args);
      case 'delete-vendor':
        return await this.vendorHandlers.deleteVendor(args);

      // Context
      case 'get-all-context-entries':
        return await this.contextHandlers.getAllContextEntries(args);
      case 'create-context-entry':
        return await this.contextHandlers.createContextEntry(args);
      case 'get-context-entry-by-id':
        return await this.contextHandlers.getContextEntryById(args);
      case 'update-context-entry':
        return await this.contextHandlers.updateContextEntry(args);
      case 'delete-context-entry':
        return await this.contextHandlers.deleteContextEntry(args);

      // Devices
      case 'get-all-devices':
        return await this.deviceHandlers.getAllDevices(args);
      case 'get-devices-by-member-id':
        return await this.deviceHandlers.getDevicesByMemberId(args);

      // Policies
      case 'get-all-policies':
        return await this.policyHandlers.getAllPolicies(args);
      case 'create-policy':
        return await this.policyHandlers.createPolicy(args);
      case 'get-policy-by-id':
        return await this.policyHandlers.getPolicyById(args);
      case 'update-policy':
        return await this.policyHandlers.updatePolicy(args);
      case 'delete-policy':
        return await this.policyHandlers.deletePolicy(args);

      // Tasks
      case 'get-all-tasks':
        return await this.taskHandlers.getAllTasks(args);
      case 'get-task-by-id':
        return await this.taskHandlers.getTaskById(args);
      case 'get-task-attachments':
        return await this.taskHandlers.getTaskAttachments(args);
      case 'upload-attachment-to-task':
        return await this.taskHandlers.uploadAttachmentToTask(args);
      case 'get-task-attachment-download-url':
        return await this.taskHandlers.getTaskAttachmentDownloadUrl(args);
      case 'delete-task-attachment':
        return await this.taskHandlers.deleteTaskAttachment(args);

      // Comments
      case 'get-comments-for-entity':
        return await this.commentHandlers.getCommentsForEntity(args);
      case 'create-comment':
        return await this.commentHandlers.createComment(args);
      case 'update-comment':
        return await this.commentHandlers.updateComment(args);
      case 'delete-comment':
        return await this.commentHandlers.deleteComment(args);

      // Attachments
      case 'get-attachment-download-url':
        return await this.attachmentHandlers.getAttachmentDownloadUrl(args);

      // Device Agent
      case 'download-macos-device-agent':
        return await this.deviceAgentHandlers.downloadMacosDeviceAgent(args);
      case 'download-windows-device-agent':
        return await this.deviceAgentHandlers.downloadWindowsDeviceAgent(args);

      // Health
      case 'health-check':
        return await this.healthHandlers.healthCheck();

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  }

  private async configureTryComp(args: any): Promise<any> {
    const { apiKey, organizationId } = args;

    this.config.apiKey = apiKey;
    this.config.organizationId = organizationId;
    this.apiService.updateConfig(this.config);

    return {
      content: [
        {
          type: 'text',
          text: `TryComp configuration updated successfully!\nAPI Key: ${apiKey ? 'Set' : 'Not set'}\nOrganization ID: ${organizationId || 'Not set'}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}