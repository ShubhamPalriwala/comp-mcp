import { z } from 'zod';

// Helper function to validate prefixed IDs (e.g., org_xxx, risk_xxx)
const prefixedId = (prefix: string) =>
  z.string().regex(
    new RegExp(`^${prefix}_[a-f0-9]{24}$`),
    `Invalid ${prefix} ID format`
  );

// Helper to allow either prefixed or plain UUID
const flexibleId = (type: string) =>
  z.string().min(1, `${type} ID is required`);

// ============================================
// Configuration Schemas
// ============================================

export const ConfigureTryCompSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  organizationId: z.string().optional(),
});

// ============================================
// Organization Schemas
// ============================================

export const OrganizationIdSchema = z.object({
  organizationId: flexibleId('Organization').optional(),
});

export const UpdateOrganizationSchema = z.object({
  organizationId: flexibleId('Organization'),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  metadata: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  onboardingCompleted: z.boolean().optional(),
  hasAccess: z.boolean().optional(),
  fleetDmLabelId: z.number().int().positive().optional(),
  isFleetSetupCompleted: z.boolean().optional(),
});

// ============================================
// People Schemas
// ============================================

export const PaginationSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const GetAllPeopleSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const CreateMemberSchema = z.object({
  organizationId: flexibleId('Organization'),
  userId: flexibleId('User'),
  role: z.string().max(50).optional(),
  department: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  fleetDmLabelId: z.number().int().positive().optional(),
});

export const PersonIdSchema = z.object({
  personId: flexibleId('Person'),
});

export const UpdateMemberSchema = z.object({
  memberId: flexibleId('Member'),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.string().max(50).optional(),
});

export const MemberIdSchema = z.object({
  memberId: flexibleId('Member'),
});

export const AddMultipleMembersSchema = z.object({
  organizationId: flexibleId('Organization'),
  members: z.array(
    z.object({
      email: z.string().email('Invalid email format'),
      name: z.string().min(1).max(100),
      role: z.string().max(50).optional(),
    })
  ).min(1, 'At least one member is required').max(100, 'Maximum 100 members at a time'),
});

// ============================================
// Risk Schemas
// ============================================

export const GetAllRisksSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export const CreateRiskSchema = z.object({
  organizationId: flexibleId('Organization'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  category: z.string().max(50).optional(),
  department: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  likelihood: z.string().max(50).optional(),
  impact: z.string().max(50).optional(),
  residualLikelihood: z.string().max(50).optional(),
  residualImpact: z.string().max(50).optional(),
  treatmentStrategyDescription: z.string().max(2000).optional(),
  treatmentStrategy: z.string().max(100).optional(),
  assigneeId: flexibleId('Assignee').optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export const RiskIdSchema = z.object({
  riskId: flexibleId('Risk'),
});

export const UpdateRiskSchema = z.object({
  riskId: flexibleId('Risk'),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().max(50).optional(),
  department: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  likelihood: z.string().max(50).optional(),
  impact: z.string().max(50).optional(),
  residualLikelihood: z.string().max(50).optional(),
  residualImpact: z.string().max(50).optional(),
  treatmentStrategyDescription: z.string().max(2000).optional(),
  treatmentStrategy: z.string().max(100).optional(),
  assigneeId: flexibleId('Assignee').optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// ============================================
// Vendor Schemas
// ============================================

export const GetAllVendorsSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const CreateVendorSchema = z.object({
  organizationId: flexibleId('Organization'),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().max(20).optional(),
  website: z.string().url('Invalid website URL').optional(),
  category: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  inherentProbability: z.string().max(50).optional(),
  inherentImpact: z.string().max(50).optional(),
  residualProbability: z.string().max(50).optional(),
  residualImpact: z.string().max(50).optional(),
  assigneeId: flexibleId('Assignee').optional(),
});

export const VendorIdSchema = z.object({
  vendorId: flexibleId('Vendor'),
});

export const UpdateVendorSchema = z.object({
  vendorId: flexibleId('Vendor'),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().max(20).optional(),
  website: z.string().url('Invalid website URL').optional(),
  category: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  inherentProbability: z.string().max(50).optional(),
  inherentImpact: z.string().max(50).optional(),
  residualProbability: z.string().max(50).optional(),
  residualImpact: z.string().max(50).optional(),
  assigneeId: flexibleId('Assignee').optional(),
});

// ============================================
// Context Schemas
// ============================================

export const GetAllContextEntriesSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const CreateContextEntrySchema = z.object({
  organizationId: flexibleId('Organization'),
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required').max(5000),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const ContextIdSchema = z.object({
  contextId: flexibleId('Context'),
});

export const UpdateContextEntrySchema = z.object({
  contextId: flexibleId('Context'),
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).max(5000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

// ============================================
// Device Schemas
// ============================================

export const GetAllDevicesSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const GetDevicesByMemberIdSchema = z.object({
  memberId: flexibleId('Member'),
});

// ============================================
// Policy Schemas
// ============================================

export const GetAllPoliciesSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const CreatePolicySchema = z.object({
  organizationId: flexibleId('Organization'),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  content: z.any(), // TipTap JSON array - can be array of objects or string
  type: z.string().max(50).optional(),
});

export const PolicyIdSchema = z.object({
  policyId: flexibleId('Policy'),
});

export const UpdatePolicySchema = z.object({
  policyId: flexibleId('Policy'),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  content: z.any().optional(), // TipTap JSON array - can be array of objects or string
  type: z.string().max(50).optional(),
});

// ============================================
// Task Schemas
// ============================================

export const GetAllTasksSchema = z.object({
  organizationId: flexibleId('Organization'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
  status: z.string().max(50).optional(),
  assignedTo: flexibleId('Assignee').optional(),
});

export const TaskIdSchema = z.object({
  taskId: flexibleId('Task'),
});

export const UploadAttachmentToTaskSchema = z.object({
  taskId: flexibleId('Task'),
  file: z.string().min(1, 'File data is required'),
  filename: z.string().min(1, 'Filename is required').max(255),
  contentType: z.string().max(100).optional(),
});

export const GetTaskAttachmentDownloadUrlSchema = z.object({
  taskId: flexibleId('Task'),
  attachmentId: flexibleId('Attachment'),
});

export const DeleteTaskAttachmentSchema = z.object({
  taskId: flexibleId('Task'),
  attachmentId: flexibleId('Attachment'),
});

// ============================================
// Comment Schemas
// ============================================

export const GetCommentsForEntitySchema = z.object({
  entityId: flexibleId('Entity'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

export const CreateCommentSchema = z.object({
  entityId: flexibleId('Entity'),
  entityType: z.string().min(1, 'Entity type is required').max(50),
  content: z.string().min(1, 'Content is required').max(5000),
  // authorId is NOT sent to API - derived from authentication header
  attachments: z.array(
    z.object({
      fileName: z.string().min(1).max(255),
      fileType: z.string().min(1).max(100),
      fileData: z.string().min(1),
      description: z.string().max(500).optional(),
    })
  ).max(10).optional(),
});

export const CommentIdSchema = z.object({
  commentId: flexibleId('Comment'),
});

export const UpdateCommentSchema = z.object({
  commentId: flexibleId('Comment'),
  content: z.string().min(1, 'Content is required').max(5000),
});

// ============================================
// Attachment Schemas
// ============================================

export const AttachmentIdSchema = z.object({
  attachmentId: flexibleId('Attachment'),
});

// ============================================
// Device Agent Schemas
// ============================================

export const DownloadDeviceAgentSchema = z.object({
  version: z.string().max(20).optional(),
});
