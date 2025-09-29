import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { MCPResponse, TaskFilterParams, UploadAttachmentParams } from '../types/index.js';

export class TaskHandlers {
  constructor(private apiService: APIService) {}

  async getAllTasks(args: TaskFilterParams): Promise<MCPResponse> {
    const { organizationId, limit, offset, status, assignedTo } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (status) params.status = status;
    if (assignedTo) params.assignedTo = assignedTo;

    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASKS,
      params,
    });
  }

  async getTaskById(args: { taskId: string }): Promise<MCPResponse> {
    const { taskId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_BY_ID(taskId),
    });
  }

  async getTaskAttachments(args: { taskId: string }): Promise<MCPResponse> {
    const { taskId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_ATTACHMENTS(taskId),
    });
  }

  async uploadAttachmentToTask(args: UploadAttachmentParams): Promise<MCPResponse> {
    const { taskId, file, filename, contentType } = args;
    const attachmentData = { file, filename, contentType };
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.TASK_ATTACHMENTS(taskId),
      data: attachmentData,
    });
  }

  async getTaskAttachmentDownloadUrl(args: { taskId: string; attachmentId: string }): Promise<MCPResponse> {
    const { taskId, attachmentId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_ATTACHMENT_DOWNLOAD(taskId, attachmentId),
    });
  }

  async deleteTaskAttachment(args: { taskId: string; attachmentId: string }): Promise<MCPResponse> {
    const { taskId, attachmentId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.TASK_ATTACHMENT_BY_ID(taskId, attachmentId),
    });
  }
}