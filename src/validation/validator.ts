import { z, ZodError } from 'zod';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

/**
 * Validates data against a Zod schema and throws MCP-compatible errors
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      throw new McpError(
        ErrorCode.InvalidParams,
        `Validation failed: ${errorMessages}`
      );
    }
    throw error;
  }
}

/**
 * Safely validates data and returns result with success flag
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errorMessages = result.error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join('; ');

  return { success: false, error: errorMessages };
}
