import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { MCPResponse } from '../types/index.js';

export class OrganizationHandlers {
  constructor(private apiService: APIService) {}

  async getOrganizationInformation(args: any): Promise<any> {
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.ORGANIZATION,
    });
  }

  async updateOrganization(args: any): Promise<any> {
    const { organizationId, ...updateData } = args;
    return await this.apiService.makeRequest({
      method: 'PATCH',
      endpoint: ENDPOINTS.ORGANIZATION,
      data: updateData,
    });
  }

  async deleteOrganization(args: any): Promise<any> {
    const { organizationId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.ORGANIZATION_BY_ID(organizationId),
    });
  }
}