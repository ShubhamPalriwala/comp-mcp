import axios, { AxiosRequestConfig } from 'axios';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { API_BASE_URL } from '../config/constants.js';
import { TryCompConfig, APIRequestConfig, MCPResponse } from '../types/index.js';

export class APIService {
  constructor(private config: TryCompConfig) {}

  updateConfig(config: Partial<TryCompConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async makeRequest({ method, endpoint, data, params }: APIRequestConfig): Promise<any> {
    if (!this.config.apiKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'API key is required. Configure it using configure-trycomp.'
      );
    }

    const headers: Record<string, string> = {
      'X-API-Key': this.config.apiKey,
      'Content-Type': 'application/json',
    };

    if (this.config.organizationId) {
      headers['X-Organization-Id'] = this.config.organizationId;
    }

    const config: AxiosRequestConfig = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
    };

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    try {
      const response = await axios(config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      this.handleAPIError(error);
    }
  }

  private handleAPIError(error: any): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      if (status === 401) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Authentication failed: ${errorData?.error || 'Invalid API key or insufficient permissions'}`
        );
      }

      throw new McpError(
        ErrorCode.InternalError,
        `API request failed (${status}): ${errorData?.error || error.message}`
      );
    }

    throw new McpError(ErrorCode.InternalError, `Request failed: ${error}`);
  }
}