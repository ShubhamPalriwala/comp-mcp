import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { MCPResponse, PaginationParams, CreateRiskParams } from '../types/index.js';

export class RiskHandlers {
  constructor(private apiService: APIService) {}

  async getAllRisks(args: { organizationId: string; severity?: string } & PaginationParams): Promise<MCPResponse> {
    const { organizationId, limit, offset, severity } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (severity) params.severity = severity;

    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.RISKS,
      params,
    });
  }

  async createRisk(args: CreateRiskParams): Promise<MCPResponse> {
    const { organizationId, ...riskData } = args;
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.RISKS,
      data: riskData,
    });
  }

  async getRiskById(args: { riskId: string }): Promise<MCPResponse> {
    const { riskId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.RISK_BY_ID(riskId),
    });
  }

  async updateRisk(args: any): Promise<MCPResponse> {
    const { riskId, ...updateData } = args;
    return await this.apiService.makeRequest({
      method: 'PATCH',
      endpoint: ENDPOINTS.RISK_BY_ID(riskId),
      data: updateData,
    });
  }

  async deleteRisk(args: { riskId: string }): Promise<MCPResponse> {
    const { riskId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.RISK_BY_ID(riskId),
    });
  }
}