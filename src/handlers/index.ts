import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { MCPResponse, PaginationParams, CreateContextParams, CreatePolicyParams, CreateCommentParams } from '../types/index.js';

// Simple handlers for remaining endpoints
export class ContextHandlers {
  constructor(private apiService: APIService) {}

  async getAllContextEntries(args: { organizationId: string } & PaginationParams): Promise<MCPResponse> {
    const { organizationId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.CONTEXT, params });
  }

  async createContextEntry(args: CreateContextParams): Promise<MCPResponse> {
    const { organizationId, question, answer, tags } = args;
    const contextData: any = { question, answer };
    if (tags) {
      contextData.tags = tags;
    }
    return await this.apiService.makeRequest({ method: 'POST', endpoint: ENDPOINTS.CONTEXT, data: contextData });
  }

  async getContextEntryById(args: { contextId: string }): Promise<MCPResponse> {
    const { contextId } = args;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.CONTEXT_BY_ID(contextId) });
  }

  async updateContextEntry(args: any): Promise<MCPResponse> {
    const { contextId, question, answer, tags } = args;
    const updateData: any = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (tags !== undefined) updateData.tags = tags;
    return await this.apiService.makeRequest({ method: 'PATCH', endpoint: ENDPOINTS.CONTEXT_BY_ID(contextId), data: updateData });
  }

  async deleteContextEntry(args: { contextId: string }): Promise<MCPResponse> {
    const { contextId } = args;
    return await this.apiService.makeRequest({ method: 'DELETE', endpoint: ENDPOINTS.CONTEXT_BY_ID(contextId) });
  }
}

export class DeviceHandlers {
  constructor(private apiService: APIService) {}

  async getAllDevices(args: { organizationId: string } & PaginationParams): Promise<MCPResponse> {
    const { organizationId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.DEVICES, params });
  }

  async getDevicesByMemberId(args: { memberId: string }): Promise<MCPResponse> {
    const { memberId } = args;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.DEVICES_BY_MEMBER(memberId) });
  }
}

export class PolicyHandlers {
  constructor(private apiService: APIService) {}

  async getAllPolicies(args: { organizationId: string } & PaginationParams): Promise<MCPResponse> {
    const { organizationId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.POLICIES, params });
  }

  async createPolicy(args: CreatePolicyParams): Promise<MCPResponse> {
    const { organizationId, ...policyData } = args;
    return await this.apiService.makeRequest({ method: 'POST', endpoint: ENDPOINTS.POLICIES, data: policyData });
  }

  async getPolicyById(args: { policyId: string }): Promise<MCPResponse> {
    const { policyId } = args;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.POLICY_BY_ID(policyId) });
  }

  async updatePolicy(args: any): Promise<MCPResponse> {
    const { policyId, ...updateData } = args;
    return await this.apiService.makeRequest({ method: 'PATCH', endpoint: ENDPOINTS.POLICY_BY_ID(policyId), data: updateData });
  }

  async deletePolicy(args: { policyId: string }): Promise<MCPResponse> {
    const { policyId } = args;
    return await this.apiService.makeRequest({ method: 'DELETE', endpoint: ENDPOINTS.POLICY_BY_ID(policyId) });
  }
}

export class CommentHandlers {
  constructor(private apiService: APIService) {}

  async getCommentsForEntity(args: { entityId: string } & PaginationParams): Promise<MCPResponse> {
    const { entityId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.COMMENTS_BY_ENTITY(entityId), params });
  }

  async createComment(args: CreateCommentParams): Promise<MCPResponse> {
    const { entityId, entityType, content, authorId, attachments } = args;
    const commentData: any = { entityId, entityType, content, authorId };
    if (attachments) {
      commentData.attachments = attachments;
    }
    return await this.apiService.makeRequest({ method: 'POST', endpoint: ENDPOINTS.COMMENTS, data: commentData });
  }

  async updateComment(args: { commentId: string; content: string }): Promise<MCPResponse> {
    const { commentId, content } = args;
    return await this.apiService.makeRequest({ method: 'PUT', endpoint: ENDPOINTS.COMMENT_BY_ID(commentId), data: { content } });
  }

  async deleteComment(args: { commentId: string }): Promise<MCPResponse> {
    const { commentId } = args;
    return await this.apiService.makeRequest({ method: 'DELETE', endpoint: ENDPOINTS.COMMENT_BY_ID(commentId) });
  }
}

export class AttachmentHandlers {
  constructor(private apiService: APIService) {}

  async getAttachmentDownloadUrl(args: { attachmentId: string }): Promise<MCPResponse> {
    const { attachmentId } = args;
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.ATTACHMENT_DOWNLOAD(attachmentId) });
  }
}

export class DeviceAgentHandlers {
  constructor(private apiService: APIService) {}

  async downloadMacosDeviceAgent(args: { version?: string }): Promise<MCPResponse> {
    const { version } = args;
    const params = version ? { version } : {};
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.MACOS_AGENT, params });
  }

  async downloadWindowsDeviceAgent(args: { version?: string }): Promise<MCPResponse> {
    const { version } = args;
    const params = version ? { version } : {};
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.WINDOWS_AGENT, params });
  }
}

export class HealthHandlers {
  constructor(private apiService: APIService) {}

  async healthCheck(): Promise<MCPResponse> {
    return await this.apiService.makeRequest({ method: 'GET', endpoint: ENDPOINTS.HEALTH });
  }
}