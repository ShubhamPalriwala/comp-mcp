/**
 * MCP Prompts Configuration
 * Prompts are pre-built templates that help users accomplish common tasks
 */

export const PROMPTS = [
  {
    name: 'create-vendor-risk-assessment',
    description: 'Generate a comprehensive risk assessment for a new vendor',
    arguments: [
      {
        name: 'vendorName',
        description: 'Name of the vendor to assess',
        required: true,
      },
      {
        name: 'vendorCategory',
        description: 'Category of vendor (e.g., cloud, SaaS, infrastructure)',
        required: true,
      },
      {
        name: 'dataAccess',
        description: 'What type of data will the vendor access?',
        required: false,
      },
    ],
  },

  {
    name: 'generate-compliance-checklist',
    description: 'Create a customized compliance checklist for a specific framework',
    arguments: [
      {
        name: 'framework',
        description: 'Compliance framework (SOC2, ISO27001, HIPAA, GDPR)',
        required: true,
      },
      {
        name: 'scope',
        description: 'Scope of the assessment (e.g., entire organization, specific system)',
        required: false,
      },
    ],
  },

  {
    name: 'draft-security-incident-report',
    description: 'Create a structured security incident report',
    arguments: [
      {
        name: 'incidentSummary',
        description: 'Brief summary of the incident',
        required: true,
      },
      {
        name: 'severity',
        description: 'Severity level (low, medium, high, critical)',
        required: true,
      },
      {
        name: 'affectedSystems',
        description: 'Systems or services affected',
        required: false,
      },
    ],
  },

  {
    name: 'create-policy-from-template',
    description: 'Generate a policy document from a template',
    arguments: [
      {
        name: 'policyType',
        description: 'Type of policy (information-security, vendor-management, incident-response, data-privacy)',
        required: true,
      },
      {
        name: 'organizationName',
        description: 'Organization name to customize the policy',
        required: true,
      },
      {
        name: 'customizations',
        description: 'Any specific customizations or additions needed',
        required: false,
      },
    ],
  },

  {
    name: 'analyze-risk-trends',
    description: 'Analyze risk trends and provide insights',
    arguments: [
      {
        name: 'timeframe',
        description: 'Time period to analyze (e.g., last 30 days, last quarter)',
        required: false,
      },
      {
        name: 'riskCategory',
        description: 'Specific risk category to focus on',
        required: false,
      },
    ],
  },

  {
    name: 'prepare-audit-evidence',
    description: 'Prepare evidence package for an audit',
    arguments: [
      {
        name: 'auditType',
        description: 'Type of audit (SOC2, ISO27001, internal)',
        required: true,
      },
      {
        name: 'controlArea',
        description: 'Specific control area or domain',
        required: false,
      },
    ],
  },
] as const;

// Prompt handlers - these generate the actual prompt text
export const PROMPT_HANDLERS: Record<string, (args: Record<string, string>) => string> = {
  'create-vendor-risk-assessment': (args) => `
You are a compliance expert helping to assess vendor risk. Please create a comprehensive risk assessment for the following vendor:

**Vendor Name:** ${args.vendorName}
**Category:** ${args.vendorCategory}
${args.dataAccess ? `**Data Access:** ${args.dataAccess}` : ''}

Please provide:

1. **Executive Summary**
   - Overview of the vendor
   - Key risk areas identified
   - Overall risk rating (Low/Medium/High/Critical)

2. **Security Assessment**
   - Authentication and access controls
   - Data encryption practices
   - Security certifications (SOC 2, ISO 27001, etc.)
   - Penetration testing and vulnerability management

3. **Compliance Review**
   - Relevant compliance frameworks
   - Data protection and privacy measures
   - Regulatory requirements met

4. **Operational Risks**
   - Business continuity planning
   - Service availability and SLAs
   - Incident response capabilities

5. **Risk Mitigation Plan**
   - Recommended controls
   - Contract requirements
   - Ongoing monitoring approach

6. **Decision Recommendation**
   - Approve/Reject/Conditional approval
   - Next steps

Use the risk categories resource (comp://templates/risk-categories) and security review checklist (comp://checklists/security-review) to structure your assessment.
`,

  'generate-compliance-checklist': (args) => `
Create a comprehensive compliance checklist for ${args.framework} ${args.scope ? `focusing on: ${args.scope}` : ''}.

Please structure the checklist with:

1. **Framework Overview**
   - Brief description of ${args.framework}
   - Key objectives and principles

2. **Control Categories**
   - Organize by control domains
   - List specific requirements for each

3. **Evidence Requirements**
   - What documentation is needed
   - What technical evidence to collect
   - Interview requirements

4. **Implementation Checklist**
   - Step-by-step tasks
   - Priority levels
   - Estimated effort

5. **Gap Analysis Template**
   - Current state assessment
   - Gap identification
   - Remediation plan

Reference the relevant framework resource:
${args.framework.toLowerCase().includes('soc') ? '- comp://frameworks/soc2' : ''}
${args.framework.toLowerCase().includes('iso') ? '- comp://frameworks/iso27001' : ''}
${args.framework.toLowerCase().includes('hipaa') ? '- comp://frameworks/hipaa' : ''}
`,

  'draft-security-incident-report': (args) => `
Create a detailed security incident report for the following incident:

**Incident Summary:** ${args.incidentSummary}
**Severity Level:** ${args.severity}
${args.affectedSystems ? `**Affected Systems:** ${args.affectedSystems}` : ''}

Please structure the report with:

1. **Incident Overview**
   - Date and time of discovery
   - Incident ID (generate a placeholder)
   - Incident classification
   - Severity justification

2. **Timeline of Events**
   - Detection
   - Initial response
   - Containment actions
   - Investigation steps
   - Resolution

3. **Impact Assessment**
   - Systems affected
   - Data potentially compromised
   - Business operations impact
   - Customer impact (if any)

4. **Root Cause Analysis**
   - How the incident occurred
   - Contributing factors
   - Vulnerabilities exploited

5. **Response Actions Taken**
   - Immediate containment
   - Investigation activities
   - Communication plan
   - Remediation steps

6. **Lessons Learned**
   - What worked well
   - What could be improved
   - Preventive measures

7. **Follow-up Actions**
   - Short-term fixes
   - Long-term improvements
   - Policy/process updates needed
   - Training requirements

8. **Compliance Considerations**
   - Breach notification requirements
   - Regulatory reporting needed
   - Customer notification plan
`,

  'create-policy-from-template': (args) => `
Generate a comprehensive ${args.policyType} policy document for ${args.organizationName}.

${args.customizations ? `**Customization Requirements:** ${args.customizations}` : ''}

Please create a policy document with:

1. **Policy Header**
   - Policy name
   - Version and effective date
   - Owner and approver
   - Review frequency

2. **Purpose and Scope**
   - Why this policy exists
   - Who it applies to
   - What it covers

3. **Policy Statements**
   - Clear, enforceable rules
   - Specific requirements
   - Exceptions and exemptions

4. **Roles and Responsibilities**
   - Who is responsible for what
   - Accountability structure

5. **Implementation**
   - How to comply
   - Required tools/systems
   - Training requirements

6. **Monitoring and Enforcement**
   - Compliance measurement
   - Violation consequences
   - Audit procedures

7. **Related Documents**
   - Related policies
   - Procedures and guidelines
   - External references

8. **Revision History**
   - Template for tracking changes

Use the policy template library resource (comp://templates/policy-library) for structure and best practices.

Ensure the policy aligns with relevant compliance frameworks and industry standards.
`,

  'analyze-risk-trends': (args) => `
Perform a comprehensive risk trend analysis ${args.timeframe ? `for ${args.timeframe}` : ''} ${args.riskCategory ? `focusing on ${args.riskCategory} risks` : ''}.

Please:

1. **Fetch Current Risk Data**
   Use get-all-risks to retrieve the latest risk information${args.riskCategory ? ` filtered by category: ${args.riskCategory}` : ''}

2. **Analyze Trends**
   - Risk creation rate
   - Risk closure rate
   - Distribution by severity
   - Distribution by category
   - Treatment strategy patterns

3. **Identify Patterns**
   - Recurring risk themes
   - High-risk areas
   - Improvement areas
   - Emerging risks

4. **Provide Insights**
   - Key findings
   - Risk appetite alignment
   - Recommendations
   - Priority actions

5. **Visualize Data**
   - Create summary statistics
   - Highlight critical trends
   - Compare to best practices

6. **Action Items**
   - Recommended focus areas
   - Resource allocation suggestions
   - Process improvements
`,

  'prepare-audit-evidence': (args) => `
Prepare a comprehensive evidence package for a ${args.auditType} audit${args.controlArea ? ` focusing on ${args.controlArea}` : ''}.

Please:

1. **Evidence Collection Plan**
   - Required documents
   - System screenshots needed
   - Log exports required
   - Interview subjects

2. **Policy and Procedure Evidence**
   Use get-all-policies to retrieve current policies
   - Identify gaps
   - Check approval status
   - Verify review dates

3. **Risk Management Evidence**
   Use get-all-risks to show risk assessment
   - Risk register completeness
   - Risk treatment documentation
   - Risk review cadence

4. **Vendor Management Evidence**
   Use get-all-vendors to document third parties
   - Vendor assessments
   - Security reviews
   - Contract compliance

5. **Task and Compliance Evidence**
   Use get-all-tasks to show ongoing compliance
   - Completed tasks
   - Recurring controls
   - Evidence attachments

6. **Evidence Organization**
   - Create evidence matrix
   - Map to control requirements
   - Identify missing evidence
   - Prioritize collection

7. **Recommendations**
   - Quick wins for evidence gaps
   - Process improvements
   - Documentation needs
`,
};
