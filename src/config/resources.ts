/**
 * MCP Resources Configuration
 * Resources are read-only data sources that can be accessed by the LLM
 */

export const RESOURCES = [
  // Organization Information
  {
    uri: 'comp://organization/info',
    name: 'Organization Information',
    description: 'Current organization details and settings',
    mimeType: 'application/json',
  },

  // Risk Templates
  {
    uri: 'comp://templates/risk-categories',
    name: 'Risk Categories Template',
    description: 'Standard risk categories and their descriptions for risk assessments',
    mimeType: 'application/json',
  },

  // Compliance Frameworks
  {
    uri: 'comp://frameworks/soc2',
    name: 'SOC 2 Compliance Framework',
    description: 'SOC 2 Trust Service Criteria and control requirements',
    mimeType: 'text/markdown',
  },

  {
    uri: 'comp://frameworks/iso27001',
    name: 'ISO 27001 Framework',
    description: 'ISO 27001 information security management requirements',
    mimeType: 'text/markdown',
  },

  {
    uri: 'comp://frameworks/hipaa',
    name: 'HIPAA Compliance Framework',
    description: 'HIPAA privacy and security rule requirements',
    mimeType: 'text/markdown',
  },

  // Policy Templates
  {
    uri: 'comp://templates/policy-library',
    name: 'Policy Template Library',
    description: 'Pre-built policy templates for common compliance needs',
    mimeType: 'application/json',
  },

  // Task Checklists
  {
    uri: 'comp://checklists/security-review',
    name: 'Security Review Checklist',
    description: 'Comprehensive security review checklist for vendors and systems',
    mimeType: 'text/markdown',
  },
] as const;

// Resource content providers
export const RESOURCE_CONTENT: Record<string, () => Promise<string>> = {
  'comp://templates/risk-categories': async () => JSON.stringify({
    categories: [
      {
        id: 'technology',
        name: 'Technology Risk',
        description: 'Risks related to IT systems, infrastructure, and cybersecurity',
        examples: [
          'Data breaches',
          'System outages',
          'Software vulnerabilities',
          'Cloud misconfigurations'
        ],
        mitigationStrategies: [
          'Implement security controls',
          'Regular vulnerability scanning',
          'Backup and disaster recovery plans',
          'Access management'
        ]
      },
      {
        id: 'vendor_management',
        name: 'Vendor Management Risk',
        description: 'Risks from third-party vendors and service providers',
        examples: [
          'Vendor security breaches',
          'Service level failures',
          'Vendor bankruptcy',
          'Data sharing risks'
        ],
        mitigationStrategies: [
          'Vendor due diligence',
          'Contract reviews',
          'Regular assessments',
          'Diversification of vendors'
        ]
      },
      {
        id: 'regulatory',
        name: 'Regulatory & Compliance Risk',
        description: 'Risks related to regulatory requirements and compliance obligations',
        examples: [
          'GDPR violations',
          'HIPAA non-compliance',
          'SOC 2 audit failures',
          'Industry regulation changes'
        ],
        mitigationStrategies: [
          'Regular compliance audits',
          'Policy updates',
          'Staff training',
          'Legal counsel engagement'
        ]
      },
      {
        id: 'operational',
        name: 'Operational Risk',
        description: 'Risks from day-to-day business operations',
        examples: [
          'Process failures',
          'Human error',
          'Resource constraints',
          'Communication breakdowns'
        ],
        mitigationStrategies: [
          'Standard operating procedures',
          'Training programs',
          'Quality assurance',
          'Resource planning'
        ]
      },
      {
        id: 'people',
        name: 'People Risk',
        description: 'Risks related to employees, contractors, and human resources',
        examples: [
          'Key person dependency',
          'Insider threats',
          'Skills gaps',
          'Employee turnover'
        ],
        mitigationStrategies: [
          'Cross-training',
          'Background checks',
          'Access controls',
          'Succession planning'
        ]
      }
    ]
  }, null, 2),

  'comp://frameworks/soc2': async () => `# SOC 2 Trust Service Criteria

## Overview
SOC 2 is an auditing procedure that ensures service providers securely manage data to protect the interests and privacy of their clients.

## Trust Service Criteria

### 1. Security (Required)
The system is protected against unauthorized access, use, or modification.

**Key Controls:**
- Access controls and authentication
- Network security
- System monitoring
- Incident response
- Change management

### 2. Availability
The system is available for operation and use as committed or agreed.

**Key Controls:**
- System monitoring and alerting
- Backup and disaster recovery
- Capacity planning
- Performance monitoring
- Service level agreements

### 3. Processing Integrity
System processing is complete, valid, accurate, timely, and authorized.

**Key Controls:**
- Input validation
- Error handling
- Quality assurance
- Data integrity checks
- Transaction logging

### 4. Confidentiality
Information designated as confidential is protected as committed or agreed.

**Key Controls:**
- Data classification
- Encryption at rest and in transit
- Confidentiality agreements
- Secure disposal
- Access restrictions

### 5. Privacy
Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments.

**Key Controls:**
- Privacy notice
- Consent management
- Data minimization
- Retention policies
- Right to deletion

## Common Evidence Required
- Security policies and procedures
- Access control logs
- Penetration test results
- Vulnerability scan reports
- Incident response logs
- Change management records
- Backup and recovery tests
- Training records
- Vendor assessment reports
`,

  'comp://templates/policy-library': async () => JSON.stringify({
    templates: [
      {
        id: 'information-security',
        name: 'Information Security Policy',
        category: 'security',
        description: 'Comprehensive information security policy covering data protection, access control, and security practices',
        frameworks: ['SOC 2', 'ISO 27001', 'HIPAA'],
        sections: [
          'Purpose and Scope',
          'Information Classification',
          'Access Control',
          'Acceptable Use',
          'Incident Response',
          'Compliance and Enforcement'
        ]
      },
      {
        id: 'vendor-management',
        name: 'Vendor Management Policy',
        category: 'vendor',
        description: 'Policy for selecting, onboarding, and managing third-party vendors',
        frameworks: ['SOC 2', 'ISO 27001'],
        sections: [
          'Vendor Selection Criteria',
          'Due Diligence Requirements',
          'Contract Requirements',
          'Ongoing Monitoring',
          'Vendor Risk Assessment',
          'Offboarding Procedures'
        ]
      },
      {
        id: 'incident-response',
        name: 'Incident Response Policy',
        category: 'security',
        description: 'Policy and procedures for identifying, responding to, and recovering from security incidents',
        frameworks: ['SOC 2', 'ISO 27001', 'HIPAA'],
        sections: [
          'Incident Classification',
          'Response Team Roles',
          'Detection and Reporting',
          'Containment Procedures',
          'Investigation Process',
          'Post-Incident Review'
        ]
      },
      {
        id: 'data-privacy',
        name: 'Data Privacy Policy',
        category: 'privacy',
        description: 'Policy covering personal data collection, processing, and protection',
        frameworks: ['GDPR', 'HIPAA', 'SOC 2'],
        sections: [
          'Data Collection Practices',
          'Lawful Basis for Processing',
          'Data Subject Rights',
          'Data Retention',
          'International Transfers',
          'Breach Notification'
        ]
      }
    ]
  }, null, 2),

  'comp://checklists/security-review': async () => `# Security Review Checklist

## Vendor Security Assessment

### Pre-Engagement
- [ ] Identify vendor criticality level
- [ ] Define scope of assessment
- [ ] Determine data classification
- [ ] Establish timeline

### Security Questionnaire
- [ ] Request completed security questionnaire
- [ ] Verify SOC 2 Type II report (if applicable)
- [ ] Review ISO 27001 certification
- [ ] Check for penetration test results

### Technical Security
- [ ] Encryption at rest enabled
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Multi-factor authentication available
- [ ] Regular security patching process
- [ ] Vulnerability management program
- [ ] Intrusion detection/prevention

### Access & Identity
- [ ] Role-based access control (RBAC)
- [ ] Single sign-on (SSO) support
- [ ] Session management
- [ ] Password complexity requirements
- [ ] Account lockout policies

### Data Protection
- [ ] Data backup procedures
- [ ] Disaster recovery plan
- [ ] Data retention policies
- [ ] Secure data disposal
- [ ] Geographic data restrictions

### Compliance
- [ ] Privacy policy reviewed
- [ ] Data processing agreement (DPA)
- [ ] Business associate agreement (BAA) if HIPAA
- [ ] Subprocessor disclosure
- [ ] Compliance certifications verified

### Business Continuity
- [ ] Uptime SLA defined
- [ ] Incident response plan
- [ ] Business continuity plan
- [ ] Regular backup testing
- [ ] Redundancy measures

### Contract Review
- [ ] Liability limitations acceptable
- [ ] Data ownership clarity
- [ ] Termination and transition plan
- [ ] Audit rights included
- [ ] Insurance coverage verified

## System Security Review

### Infrastructure
- [ ] Network segmentation
- [ ] Firewall configuration
- [ ] DDoS protection
- [ ] Load balancing
- [ ] Auto-scaling configured

### Application Security
- [ ] Input validation
- [ ] Output encoding
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers configured

### Monitoring & Logging
- [ ] Centralized logging
- [ ] Log retention policy
- [ ] Security event monitoring
- [ ] Alerting configured
- [ ] Log analysis process

### Access Management
- [ ] Principle of least privilege
- [ ] Privileged access management
- [ ] Access review process
- [ ] Segregation of duties
- [ ] Audit trail of access changes
`,
};
