export interface TryCompConfig {
  apiKey?: string;
  organizationId?: string;
}

export interface APIRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  params?: any;
}

export interface MCPResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface ToolHandler {
  (args: any): Promise<MCPResponse>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface OrganizationParams {
  organizationId: string;
}

export interface UpdateOrganizationParams extends OrganizationParams {
  name?: string;
  slug?: string;
  logo?: string;
  metadata?: string;
  website?: string;
  onboardingCompleted?: boolean;
  hasAccess?: boolean;
  fleetDmLabelId?: number;
  isFleetSetupCompleted?: boolean;
}

// Specific entity interfaces
export interface CreateMemberParams extends OrganizationParams {
  userId: string;
  role?: string;
  department?: string;
  isActive?: boolean;
  fleetDmLabelId?: number;
}

export interface CreateRiskParams extends OrganizationParams {
  title: string;
  description?: string;
  category?: string;
  department?: string;
  status?: string;
  likelihood?: string;
  impact?: string;
  residualLikelihood?: string;
  residualImpact?: string;
  treatmentStrategyDescription?: string;
  treatmentStrategy?: string;
  assigneeId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateVendorParams extends OrganizationParams {
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  category?: string;
  status?: string;
  inherentProbability?: string;
  inherentImpact?: string;
  residualProbability?: string;
  residualImpact?: string;
  assigneeId?: string;
}

export interface CreateContextParams extends OrganizationParams {
  question: string;
  answer: string;
  tags?: string[];
}

export interface CreatePolicyParams extends OrganizationParams {
  title: string;
  description?: string;
  content: string;
  type?: string;
}

export interface CreateCommentParams {
  entityId: string;
  entityType: string;
  content: string;
  authorId: string;
  attachments?: Array<{
    fileName: string;
    fileType: string;
    fileData: string;
    description?: string;
  }>;
}

export interface TaskFilterParams extends OrganizationParams, PaginationParams {
  status?: string;
  assignedTo?: string;
}

export interface UploadAttachmentParams {
  taskId: string;
  file: string;
  filename: string;
  contentType?: string;
}