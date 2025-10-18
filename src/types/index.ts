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
  name: string;
  description?: string;
  content: any[]; // TipTap JSON array
  type?: string;
}

export interface CreateCommentParams {
  entityId: string;
  entityType: string;
  content: string;
  authorId?: string; // Optional - derived from auth if not provided
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

// ============================================
// API Response Types
// ============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, any>;
  website?: string;
  onboardingCompleted: boolean;
  hasAccess: boolean;
  fleetDmLabelId?: number;
  isFleetSetupCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role?: string;
  department?: string;
  isActive: boolean;
  fleetDmLabelId?: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Risk {
  id: string;
  organizationId: string;
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
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignee?: Member;
}

export interface Vendor {
  id: string;
  organizationId: string;
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
  createdAt: string;
  updatedAt: string;
  assignee?: Member;
}

export interface ContextEntry {
  id: string;
  organizationId: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  organizationId: string;
  memberId?: string;
  hostname: string;
  platform: string;
  osVersion: string;
  serialNumber?: string;
  model?: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
  member?: Member;
}

export interface Policy {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  content: any[]; // TipTap JSON array
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: Member;
}

export interface Comment {
  id: string;
  entityId: string;
  entityType: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: Member;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  description?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface DownloadUrl {
  url: string;
  expiresAt: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version?: string;
  timestamp: string;
}