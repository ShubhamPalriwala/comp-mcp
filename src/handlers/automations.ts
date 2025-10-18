import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';

export class AutomationHandlers {
  constructor(private apiService: APIService) {}

  async getAllAutomationsForTask(args: { taskId: string }): Promise<any> {
    const { taskId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_AUTOMATIONS(taskId),
    });
  }

  async createEvidenceAutomation(args: { taskId: string }): Promise<any> {
    const { taskId } = args;
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.TASK_AUTOMATIONS(taskId),
      data: { taskId },
    });
  }

  async getAutomationDetails(args: { taskId: string; automationId: string }): Promise<any> {
    const { taskId, automationId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_AUTOMATION_BY_ID(taskId, automationId),
    });
  }

  async updateAutomation(args: { taskId: string; automationId: string; data: any }): Promise<any> {
    const { taskId, automationId, ...updateData } = args;
    return await this.apiService.makeRequest({
      method: 'PATCH',
      endpoint: ENDPOINTS.TASK_AUTOMATION_BY_ID(taskId, automationId),
      data: updateData,
    });
  }

  async deleteAutomation(args: { taskId: string; automationId: string }): Promise<any> {
    const { taskId, automationId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.TASK_AUTOMATION_BY_ID(taskId, automationId),
    });
  }

  async getAllAutomationRuns(args: { taskId: string }): Promise<any> {
    const { taskId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_AUTOMATION_RUNS(taskId),
    });
  }

  async getAllVersionsForAutomation(args: { taskId: string; automationId: string }): Promise<any> {
    const { taskId, automationId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TASK_AUTOMATION_VERSIONS(taskId, automationId),
    });
  }
}
