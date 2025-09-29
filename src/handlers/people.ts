import { APIService } from '../services/api.js';
import { ENDPOINTS } from '../config/constants.js';
import { PaginationParams } from '../types/index.js';

export class PeopleHandlers {
  constructor(private apiService: APIService) {}

  async getAllPeople(args: { organizationId: string } & PaginationParams): Promise<any> {
    const { organizationId, limit, offset } = args;
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.PEOPLE,
      params,
    });
  }

  async createMember(args: any): Promise<any> {
    const { organizationId, ...memberData } = args;
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.PEOPLE,
      data: memberData,
    });
  }

  async getPersonById(args: { personId: string }): Promise<any> {
    const { personId } = args;
    return await this.apiService.makeRequest({
      method: 'GET',
      endpoint: ENDPOINTS.PERSON_BY_ID(personId),
    });
  }

  async updateMember(args: any): Promise<any> {
    const { memberId, ...updateData } = args;
    return await this.apiService.makeRequest({
      method: 'PATCH',
      endpoint: ENDPOINTS.PERSON_BY_ID(memberId),
      data: updateData,
    });
  }

  async deleteMember(args: { memberId: string }): Promise<any> {
    const { memberId } = args;
    return await this.apiService.makeRequest({
      method: 'DELETE',
      endpoint: ENDPOINTS.PERSON_BY_ID(memberId),
    });
  }

  async addMultipleMembers(args: { organizationId: string; members: any[] }): Promise<any> {
    const { organizationId, members } = args;
    return await this.apiService.makeRequest({
      method: 'POST',
      endpoint: ENDPOINTS.PEOPLE_BULK,
      data: { members },
    });
  }
}