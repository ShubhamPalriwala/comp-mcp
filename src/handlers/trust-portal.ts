import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';

export class TrustPortalHandlers {
  constructor(private apiService: APIService) {}

  async getDomainVerificationStatus(args: { domain: string }): Promise<any> {
    const { domain } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.TRUST_PORTAL_DOMAIN_STATUS,
      params: { domain },
    });
  }
}
