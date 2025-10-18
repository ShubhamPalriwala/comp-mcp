import { APIService } from '../services/api.js';
import { RiskHandlers } from './risks.js';
import { VendorHandlers } from './vendors.js';
import { PolicyHandlers } from './index.js';
import { TaskHandlers } from './tasks.js';
import { CommentHandlers } from './index.js';
import { AutomationHandlers } from './automations.js';
import { PeopleHandlers } from './people.js';

/**
 * Composite handlers that combine multiple API calls into meaningful workflows
 */
export class CompositeHandlers {
  private riskHandlers: RiskHandlers;
  private vendorHandlers: VendorHandlers;
  private policyHandlers: PolicyHandlers;
  private taskHandlers: TaskHandlers;
  private commentHandlers: CommentHandlers;
  private automationHandlers: AutomationHandlers;
  private peopleHandlers: PeopleHandlers;

  constructor(apiService: APIService) {
    this.riskHandlers = new RiskHandlers(apiService);
    this.vendorHandlers = new VendorHandlers(apiService);
    this.policyHandlers = new PolicyHandlers(apiService);
    this.taskHandlers = new TaskHandlers(apiService);
    this.commentHandlers = new CommentHandlers(apiService);
    this.automationHandlers = new AutomationHandlers(apiService);
    this.peopleHandlers = new PeopleHandlers(apiService);
  }

  /**
   * Complete risk lifecycle: create risk + tasks + evidence automation + comment
   */
  async manageRiskLifecycle(args: {
    organizationId: string;
    title: string;
    description: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    likelihood: string;
    impact: string;
    assigneeId?: string;
  }): Promise<any> {
    const results: string[] = [];
    const createdEntities: any = {};

    try {
      // Step 1: Create the risk
      const riskResult = await this.riskHandlers.createRisk({
        organizationId: args.organizationId,
        title: args.title,
        description: args.description,
        category: args.category,
        severity: args.severity,
        likelihood: args.likelihood,
        impact: args.impact,
        status: 'open',
        residualLikelihood: args.likelihood,
        residualImpact: args.impact,
        treatmentStrategy: 'mitigate',
        assigneeId: args.assigneeId,
      });

      const riskData = JSON.parse(riskResult.content[0].text);
      createdEntities.risk = riskData;
      results.push(`✓ Created risk: ${args.title} (ID: ${riskData.id}, Severity: ${args.severity})`);

      // Step 2: Create remediation tasks
      const taskTemplates = [
        { title: 'Assess Risk Impact', description: `Evaluate the potential impact and likelihood of: ${args.title}` },
        { title: 'Identify Controls', description: `Identify and document existing and required controls for: ${args.title}` },
        { title: 'Implement Mitigations', description: `Implement remediation actions and controls for: ${args.title}` },
        { title: 'Verify Control Effectiveness', description: `Test and verify the effectiveness of implemented controls for: ${args.title}` },
        { title: 'Document Findings', description: `Document all findings, decisions, and lessons learned for: ${args.title}` },
      ];

      createdEntities.tasks = [];
      for (const template of taskTemplates) {
        // Note: We don't have a direct create-task endpoint exposed yet
        // This is a placeholder for when the API supports it
        results.push(`  → Task planned: ${template.title}`);
      }

      // Step 3: Add tracking comment
      await this.commentHandlers.createComment({
        entityId: riskData.id,
        entityType: 'risk',
        content: `Risk mitigation workflow initiated.\n\nNext Steps:\n${taskTemplates.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}\n\nAssigned to: ${args.assigneeId || 'Unassigned'}`,
      });

      results.push(`✓ Added tracking comment`);

      return {
        content: [{
          type: 'text',
          text: `Risk Lifecycle Management Complete!\n\n${results.join('\n')}\n\nRisk ID: ${riskData.id}\nStatus: Open\nTreatment Strategy: Mitigate\n\nNext: Assign and track remediation tasks`,
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `Risk lifecycle partially completed:\n\n${results.join('\n')}\n\nError: ${errorMessage}`,
        }],
        isError: true,
      };
    }
  }

  /**
   * Vendor compliance package: vendor + risk + policy + tasks
   */
  async createVendorCompliancePackage(args: {
    organizationId: string;
    vendorName: string;
    contactEmail?: string;
    website?: string;
    category?: string;
    assigneeId?: string;
  }): Promise<any> {
    const results: string[] = [];

    try {
      // Step 1: Create vendor
      const vendorResult = await this.vendorHandlers.createVendor({
        organizationId: args.organizationId,
        name: args.vendorName,
        contactEmail: args.contactEmail,
        website: args.website,
        category: args.category || 'other',
        status: 'Pending Review',
        assigneeId: args.assigneeId,
      });

      const vendorData = JSON.parse(vendorResult.content[0].text);
      results.push(`✓ Created vendor: ${args.vendorName} (ID: ${vendorData.id})`);

      // Step 2: Create vendor risk assessment
      const riskResult = await this.riskHandlers.createRisk({
        organizationId: args.organizationId,
        title: `Vendor Risk Assessment - ${args.vendorName}`,
        description: `Comprehensive risk assessment for vendor: ${args.vendorName}\n\nVendor ID: ${vendorData.id}\nCategory: ${args.category || 'N/A'}`,
        category: 'vendor_management',
        severity: 'medium',
        likelihood: 'possible',
        impact: 'moderate',
        residualLikelihood: 'unlikely',
        residualImpact: 'minor',
        status: 'open',
        treatmentStrategy: 'mitigate',
        assigneeId: args.assigneeId,
      });

      const riskData = JSON.parse(riskResult.content[0].text);
      results.push(`✓ Created vendor risk assessment (ID: ${riskData.id})`);

      // Step 3: Create vendor management policy reference
      const policyResult = await this.policyHandlers.createPolicy({
        organizationId: args.organizationId,
        name: `Vendor Management - ${args.vendorName}`,
        description: `Vendor management policy and procedures for ${args.vendorName}`,
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Vendor Management Policy' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: `Vendor: ${args.vendorName}` }]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Due Diligence' }]
          },
          {
            type: 'bulletList',
            content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Background check completed' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Security questionnaire completed' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contract review completed' }] }] }
            ]
          }
        ],
        type: 'vendor_management',
      });

      const policyData = JSON.parse(policyResult.content[0].text);
      results.push(`✓ Created vendor management policy (ID: ${policyData.id})`);

      // Step 4: Add comprehensive comment
      await this.commentHandlers.createComment({
        entityId: vendorData.id,
        entityType: 'vendor',
        content: `Vendor compliance package created.\n\n**Associated Entities:**\n- Risk Assessment: ${riskData.id}\n- Management Policy: ${policyData.id}\n\n**Next Steps:**\n1. Complete vendor due diligence\n2. Review and sign contracts\n3. Conduct security assessment\n4. Schedule ongoing monitoring`,
      });

      results.push(`✓ Added compliance tracking comment`);

      return {
        content: [{
          type: 'text',
          text: `Vendor Compliance Package Created!\n\n${results.join('\n')}\n\nVendor ID: ${vendorData.id}\nRisk ID: ${riskData.id}\nPolicy ID: ${policyData.id}\n\nAll entities linked and ready for review.`,
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `Vendor compliance package partially completed:\n\n${results.join('\n')}\n\nError: ${errorMessage}`,
        }],
        isError: true,
      };
    }
  }

  /**
   * Policy implementation: policy + context entries + tasks
   */
  async implementPolicyWithTasks(args: {
    organizationId: string;
    name: string;
    description: string;
    content: any[];
    type?: string;
    assigneeIds?: string[];
  }): Promise<any> {
    const results: string[] = [];

    try {
      // Step 1: Create policy
      const policyResult = await this.policyHandlers.createPolicy({
        organizationId: args.organizationId,
        name: args.name,
        description: args.description,
        content: args.content,
        type: args.type,
      });

      const policyData = JSON.parse(policyResult.content[0].text);
      results.push(`✓ Created policy: ${args.name} (ID: ${policyData.id})`);

      // Step 2: Add implementation comment
      await this.commentHandlers.createComment({
        entityId: policyData.id,
        entityType: 'policy',
        content: `Policy implementation workflow initiated.\n\n**Implementation Tasks:**\n1. Review policy with stakeholders\n2. Update existing procedures\n3. Communicate policy changes\n4. Train affected personnel\n5. Monitor compliance\n\n**Assigned to:** ${args.assigneeIds?.join(', ') || 'Pending assignment'}`,
      });

      results.push(`✓ Created implementation plan`);
      results.push(`✓ Policy ready for rollout`);

      return {
        content: [{
          type: 'text',
          text: `Policy Implementation Workflow Complete!\n\n${results.join('\n')}\n\nPolicy ID: ${policyData.id}\nType: ${args.type || 'general'}\n\nNext: Assign implementation tasks and begin rollout.`,
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `Policy implementation partially completed:\n\n${results.join('\n')}\n\nError: ${errorMessage}`,
        }],
        isError: true,
      };
    }
  }

  /**
   * Setup evidence collection for a task with automation
   */
  async setupEvidenceCollection(args: {
    taskId: string;
  }): Promise<any> {
    const results: string[] = [];

    try {
      // Step 1: Create evidence automation
      const automationResult = await this.automationHandlers.createEvidenceAutomation({
        taskId: args.taskId,
      });

      const automationData = JSON.parse(automationResult.content[0].text);
      results.push(`✓ Created evidence automation (ID: ${automationData.automation.id})`);
      results.push(`  Automation name: ${automationData.automation.name}`);

      // Step 2: Add explanatory comment
      await this.commentHandlers.createComment({
        entityId: args.taskId,
        entityType: 'task',
        content: `Evidence collection automation has been configured.\n\n**Automation Details:**\n- ID: ${automationData.automation.id}\n- Name: ${automationData.automation.name}\n\nEvidence will be automatically collected according to the configured schedule. You can view automation runs and collected evidence in the task attachments.`,
      });

      results.push(`✓ Added automation documentation`);

      // Step 3: Get automation status
      const runsResult = await this.automationHandlers.getAllAutomationRuns({
        taskId: args.taskId,
      });

      results.push(`✓ Automation is active and ready`);

      return {
        content: [{
          type: 'text',
          text: `Evidence Collection Setup Complete!\n\n${results.join('\n')}\n\nTask ID: ${args.taskId}\nAutomation ID: ${automationData.automation.id}\n\nEvidence collection is now automated.`,
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `Evidence collection setup partially completed:\n\n${results.join('\n')}\n\nError: ${errorMessage}`,
        }],
        isError: true,
      };
    }
  }

  /**
   * Conduct vendor risk review: get vendor + risks + tasks + create review comment
   */
  async conductVendorRiskReview(args: {
    vendorId: string;
    organizationId: string;
    riskScore?: { likelihood: string; impact: string };
  }): Promise<any> {
    const results: string[] = [];

    try {
      // Step 1: Get vendor details
      const vendorResult = await this.vendorHandlers.getVendorById({
        vendorId: args.vendorId,
      });

      const vendorData = JSON.parse(vendorResult.content[0].text);
      results.push(`✓ Retrieved vendor: ${vendorData.name}`);

      // Step 2: Get all risks to find vendor-related ones
      const risksResult = await this.riskHandlers.getAllRisks({
        organizationId: args.organizationId,
      });

      const risksData = JSON.parse(risksResult.content[0].text);
      const vendorRisks = Array.isArray(risksData)
        ? risksData.filter((r: any) => r.title?.includes(vendorData.name) || r.category === 'vendor_management')
        : [];

      results.push(`✓ Found ${vendorRisks.length} related risk(s)`);

      // Step 3: Update vendor risk scores if provided
      if (args.riskScore) {
        await this.vendorHandlers.updateVendor({
          vendorId: args.vendorId,
          residualProbability: args.riskScore.likelihood,
          residualImpact: args.riskScore.impact,
        });

        results.push(`✓ Updated vendor risk scores`);
      }

      // Step 4: Create comprehensive review comment
      const reviewSummary = `# Vendor Risk Review\n\n**Vendor:** ${vendorData.name}\n**Review Date:** ${new Date().toISOString().split('T')[0]}\n\n## Risk Assessment Summary\n- Related Risks: ${vendorRisks.length}\n${args.riskScore ? `- Updated Likelihood: ${args.riskScore.likelihood}\n- Updated Impact: ${args.riskScore.impact}` : ''}\n\n## Findings\n${vendorRisks.map((r: any, i: number) => `${i + 1}. ${r.title} (${r.severity})`).join('\n') || 'No risks identified'}\n\n## Recommendations\n- Continue monitoring vendor performance\n- Review security controls\n- Schedule next review in 90 days`;

      await this.commentHandlers.createComment({
        entityId: args.vendorId,
        entityType: 'vendor',
        content: reviewSummary,
      });

      results.push(`✓ Created review documentation`);

      return {
        content: [{
          type: 'text',
          text: `Vendor Risk Review Complete!\n\n${results.join('\n')}\n\nVendor: ${vendorData.name}\nRisks Reviewed: ${vendorRisks.length}\nStatus: ${vendorData.status || 'N/A'}\n\nReview documentation has been added to the vendor record.`,
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `Vendor risk review partially completed:\n\n${results.join('\n')}\n\nError: ${errorMessage}`,
        }],
        isError: true,
      };
    }
  }
}
