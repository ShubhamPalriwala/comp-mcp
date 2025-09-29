export const API_BASE_URL = 'https://api.staging.trycomp.ai/v1';

export const SERVER_INFO = {
  name: 'trycomp-mcp-server',
  version: '1.0.0',
} as const;

export const ENDPOINTS = {
  // Organization
  ORGANIZATION: '/organization',
  ORGANIZATION_BY_ID: (id: string) => `/organization/${id}`,

  // People
  PEOPLE: '/people',
  PEOPLE_BULK: '/people/bulk',
  PERSON_BY_ID: (id: string) => `/people/${id}`,

  // Risks
  RISKS: '/risks',
  RISK_BY_ID: (id: string) => `/risks/${id}`,

  // Vendors
  VENDORS: '/vendors',
  VENDOR_BY_ID: (id: string) => `/vendors/${id}`,

  // Context
  CONTEXT: '/context',
  CONTEXT_BY_ID: (id: string) => `/context/${id}`,

  // Devices
  DEVICES: '/devices',
  DEVICES_BY_MEMBER: (memberId: string) => `/devices/member/${memberId}`,

  // Policies
  POLICIES: '/policies',
  POLICY_BY_ID: (id: string) => `/policies/${id}`,

  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  TASK_ATTACHMENTS: (taskId: string) => `/tasks/${taskId}/attachments`,
  TASK_ATTACHMENT_BY_ID: (taskId: string, attachmentId: string) =>
    `/tasks/${taskId}/attachments/${attachmentId}`,
  TASK_ATTACHMENT_DOWNLOAD: (taskId: string, attachmentId: string) =>
    `/tasks/${taskId}/attachments/${attachmentId}/download-url`,

  // Comments
  COMMENTS: '/comments',
  COMMENTS_BY_ENTITY: (entityId: string) => `/comments/entity/${entityId}`,
  COMMENT_BY_ID: (id: string) => `/comments/${id}`,

  // Attachments
  ATTACHMENT_DOWNLOAD: (attachmentId: string) => `/attachments/${attachmentId}/download-url`,

  // Device Agent
  MACOS_AGENT: '/device-agent/macos/download',
  WINDOWS_AGENT: '/device-agent/windows/download',

  // Health
  HEALTH: '/health',
} as const;