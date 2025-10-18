export const TOOL_DEFINITIONS = [
  // ============================================
  // Configuration
  // ============================================
  {
    name: 'configure-trycomp',
    description: 'Configure API key and organization ID for subsequent requests',
    inputSchema: {
      type: 'object',
      properties: {
        apiKey: { type: 'string', description: 'API key for authentication' },
        organizationId: { type: 'string', description: 'Optional organization ID' },
      },
      required: ['apiKey'],
    },
  },

  // ============================================
  // Core Read Operations
  // ============================================
  {
    name: 'get-organization-information',
    description: 'Get organization information',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
      },
    },
  },
  {
    name: 'get-all-risks',
    description: 'Get all risks with optional filtering by severity',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        limit: { type: 'integer', description: 'Limit results' },
        offset: { type: 'integer', description: 'Offset results' },
        severity: { type: 'string', description: 'Filter by severity', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['organizationId'],
    },
  },
  {
    name: 'get-all-vendors',
    description: 'Get all vendors',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        limit: { type: 'integer', description: 'Limit results' },
        offset: { type: 'integer', description: 'Offset results' },
      },
      required: ['organizationId'],
    },
  },
  {
    name: 'get-all-tasks',
    description: 'Get all tasks with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        limit: { type: 'integer', description: 'Limit results' },
        offset: { type: 'integer', description: 'Offset results' },
        status: { type: 'string', description: 'Filter by status' },
        assignedTo: { type: 'string', description: 'Filter by assigned member' },
      },
      required: ['organizationId'],
    },
  },
  {
    name: 'get-all-policies',
    description: 'Get all organizational policies',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        limit: { type: 'integer', description: 'Limit results' },
        offset: { type: 'integer', description: 'Offset results' },
      },
      required: ['organizationId'],
    },
  },

  // ============================================
  // Core Create Operations
  // ============================================
  {
    name: 'create-risk',
    description: 'Create a new risk',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        title: { type: 'string', description: 'Risk title' },
        description: { type: 'string', description: 'Risk description' },
        category: { type: 'string', description: 'Risk category', enum: ['customer', 'fraud', 'governance', 'operations', 'other', 'people', 'regulatory', 'reporting', 'resilience', 'technology', 'vendor_management'] },
        department: { type: 'string', description: 'Risk department', enum: ['none', 'admin', 'gov', 'hr', 'it', 'itsm', 'qms'] },
        status: { type: 'string', description: 'Risk status', enum: ['open', 'pending', 'closed', 'archived'] },
        likelihood: { type: 'string', description: 'Risk likelihood', enum: ['very_unlikely', 'unlikely', 'possible', 'likely', 'very_likely'] },
        impact: { type: 'string', description: 'Risk impact', enum: ['insignificant', 'minor', 'moderate', 'major', 'severe'] },
        residualLikelihood: { type: 'string', description: 'Residual likelihood', enum: ['very_unlikely', 'unlikely', 'possible', 'likely', 'very_likely'] },
        residualImpact: { type: 'string', description: 'Residual impact', enum: ['insignificant', 'minor', 'moderate', 'major', 'severe'] },
        treatmentStrategyDescription: { type: 'string', description: 'Treatment strategy description' },
        treatmentStrategy: { type: 'string', description: 'Treatment strategy', enum: ['accept', 'avoid', 'mitigate', 'transfer'] },
        assigneeId: { type: 'string', description: 'Assignee member ID' },
        severity: { type: 'string', description: 'Risk severity', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['organizationId', 'title', 'description', 'category', 'status', 'likelihood', 'impact', 'residualLikelihood', 'residualImpact', 'treatmentStrategy'],
    },
  },
  {
    name: 'create-vendor',
    description: 'Create a new vendor',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        name: { type: 'string', description: 'Vendor name' },
        description: { type: 'string', description: 'Vendor description' },
        contactEmail: { type: 'string', description: 'Contact email' },
        contactPhone: { type: 'string', description: 'Contact phone' },
        website: { type: 'string', description: 'Website URL' },
        category: { type: 'string', description: 'Vendor category' },
        status: { type: 'string', description: 'Vendor status' },
        inherentProbability: { type: 'string', description: 'Inherent probability' },
        inherentImpact: { type: 'string', description: 'Inherent impact' },
        residualProbability: { type: 'string', description: 'Residual probability' },
        residualImpact: { type: 'string', description: 'Residual impact' },
        assigneeId: { type: 'string', description: 'Assignee member ID' },
      },
      required: ['organizationId', 'name', 'description', 'category', 'status', 'inherentProbability', 'inherentImpact', 'residualProbability', 'residualImpact'],
    },
  },
  {
    name: 'create-policy',
    description: 'Create a new policy',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: { type: 'string', description: 'Organization ID' },
        name: { type: 'string', description: 'Policy name' },
        description: { type: 'string', description: 'Policy description' },
        content: {
          type: 'array',
          description: 'Policy content as TipTap JSON array',
          items: { type: 'object' }
        },
        type: { type: 'string', description: 'Policy type' },
      },
      required: ['organizationId', 'name', 'content'],
    },
  },
  // TEMPORARILY DISABLED - API has contradictory validation on user identification
  // API returns "User ID is required" but rejects both userId and authorId fields
  // Waiting for API team to clarify how to identify comment author
  // {
  //   name: 'create-comment',
  //   description: 'Create a comment on any entity (risk, vendor, task, or policy). Author is automatically derived from API key authentication.',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       entityId: { type: 'string', description: 'Entity ID' },
  //       entityType: { type: 'string', description: 'Entity type', enum: ['task', 'vendor', 'risk', 'policy'] },
  //       content: { type: 'string', description: 'Comment content' },
  //       attachments: {
  //         type: 'array',
  //         description: 'Optional attachments',
  //         items: {
  //           type: 'object',
  //           properties: {
  //             fileName: { type: 'string', description: 'File name' },
  //             fileType: { type: 'string', description: 'MIME type' },
  //             fileData: { type: 'string', description: 'Base64 encoded file data' },
  //             description: { type: 'string', description: 'File description' },
  //           },
  //           required: ['fileName', 'fileType', 'fileData'],
  //         },
  //       },
  //     },
  //     required: ['entityId', 'entityType', 'content'],
  //   },
  // },

  // ============================================
  // Task Automation (High Value)
  // ============================================
  {
    name: 'create-evidence-automation',
    description: 'Create evidence collection automation for a task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
      },
      required: ['taskId'],
    },
  },
  // TEMPORARILY DISABLED - API returns 404 "Automation not found"
  // Unclear if this is expected behavior when no runs exist or endpoint path issue
  // Waiting for API team clarification
  // {
  //   name: 'get-all-automation-runs',
  //   description: 'Get all automation runs for a task to view evidence collection status',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       taskId: { type: 'string', description: 'Task ID' },
  //     },
  //     required: ['taskId'],
  //   },
  // },

  // ============================================
  // Update Operations (Only Most Common)
  // ============================================
  {
    name: 'update-risk',
    description: 'Update risk information',
    inputSchema: {
      type: 'object',
      properties: {
        riskId: { type: 'string', description: 'Risk ID' },
        title: { type: 'string', description: 'Risk title' },
        description: { type: 'string', description: 'Risk description' },
        category: { type: 'string', description: 'Risk category' },
        status: { type: 'string', description: 'Risk status' },
        likelihood: { type: 'string', description: 'Risk likelihood' },
        impact: { type: 'string', description: 'Risk impact' },
        residualLikelihood: { type: 'string', description: 'Residual likelihood' },
        residualImpact: { type: 'string', description: 'Residual impact' },
        severity: { type: 'string', description: 'Risk severity', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['riskId'],
    },
  },
  {
    name: 'update-vendor',
    description: 'Update vendor information',
    inputSchema: {
      type: 'object',
      properties: {
        vendorId: { type: 'string', description: 'Vendor ID' },
        name: { type: 'string', description: 'Vendor name' },
        description: { type: 'string', description: 'Vendor description' },
        contactEmail: { type: 'string', description: 'Contact email' },
        status: { type: 'string', description: 'Vendor status' },
        residualProbability: { type: 'string', description: 'Residual probability' },
        residualImpact: { type: 'string', description: 'Residual impact' },
      },
      required: ['vendorId'],
    },
  },

  // ============================================
  // Health
  // ============================================
  {
    name: 'health-check',
    description: 'Perform health check on the API',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // ============================================
  // HIGH-VALUE COMPOSITE WORKFLOWS
  // TEMPORARILY DISABLED - These workflows use comment creation which has API validation issues
  // Will re-enable once comment endpoint is fixed by API team
  // ============================================
  // {
  //   name: 'manage-risk-lifecycle',
  //   description: 'Complete risk lifecycle: create risk + remediation plan + tracking comment. Use this for comprehensive risk management.',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       organizationId: { type: 'string', description: 'Organization ID' },
  //       title: { type: 'string', description: 'Risk title' },
  //       description: { type: 'string', description: 'Risk description' },
  //       category: { type: 'string', description: 'Risk category', enum: ['customer', 'fraud', 'governance', 'operations', 'other', 'people', 'regulatory', 'reporting', 'resilience', 'technology', 'vendor_management'] },
  //       severity: { type: 'string', description: 'Risk severity', enum: ['low', 'medium', 'high', 'critical'] },
  //       likelihood: { type: 'string', description: 'Risk likelihood', enum: ['very_unlikely', 'unlikely', 'possible', 'likely', 'very_likely'] },
  //       impact: { type: 'string', description: 'Risk impact', enum: ['insignificant', 'minor', 'moderate', 'major', 'severe'] },
  //       assigneeId: { type: 'string', description: 'Assignee member ID' },
  //     },
  //     required: ['organizationId', 'title', 'description', 'category', 'severity', 'likelihood', 'impact'],
  //   },
  // },
  // {
  //   name: 'create-vendor-compliance-package',
  //   description: 'Complete vendor onboarding: vendor + risk assessment + policy + tracking. Use this to onboard new vendors with full compliance setup.',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       organizationId: { type: 'string', description: 'Organization ID' },
  //       vendorName: { type: 'string', description: 'Vendor name' },
  //       contactEmail: { type: 'string', description: 'Contact email' },
  //       website: { type: 'string', description: 'Website URL' },
  //       category: { type: 'string', description: 'Vendor category' },
  //       assigneeId: { type: 'string', description: 'Assignee member ID' },
  //     },
  //     required: ['organizationId', 'vendorName'],
  //   },
  // },
  // {
  //   name: 'setup-evidence-collection',
  //   description: 'Setup automated evidence collection: create automation + documentation + status. Use this to automate compliance evidence gathering.',
  //   inputSchema: {
  //     type: 'object',
  //     properties: {
  //       taskId: { type: 'string', description: 'Task ID' },
  //     },
  //     required: ['taskId'],
  //   },
  // },
] as const;
