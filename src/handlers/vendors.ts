import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { MCPResponse, PaginationParams, CreateVendorParams } from '../types/index.js';

export class VendorHandlers {
  constructor(private apiService: APIService) {}

  async getAllVendors(args: { organizationId: string } & PaginationParams): Promise<MCPResponse> {
    const { organizationId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.VENDORS,
      params,
    });
  }

  async createVendor(args: CreateVendorParams): Promise<MCPResponse> {
    const { organizationId, ...vendorData } = args;
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.VENDORS,
      data: vendorData,
    });
  }

  async getVendorById(args: { vendorId: string }): Promise<MCPResponse> {
    const { vendorId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.VENDOR_BY_ID(vendorId),
    });
  }

  async updateVendor(args: any): Promise<MCPResponse> {
    const { vendorId, ...updateData } = args;
    return await this.apiService.makeRequest({
      method: 'PATCH',
      endpoint: ENDPOINTS.VENDOR_BY_ID(vendorId),
      data: updateData,
    });
  }

  async deleteVendor(args: { vendorId: string }): Promise<MCPResponse> {
    const { vendorId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.VENDOR_BY_ID(vendorId),
    });
  }
}