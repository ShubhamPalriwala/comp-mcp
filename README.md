# TryComp.ai MCP Server

A Model Context Protocol (MCP) server for interacting with TryComp.ai API endpoints.

## Prerequisites

- Node.js 18+
- npm or yarn
- TryComp.ai API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Running with Claude Code

1. Start the MCP server:
```bash
npm start
```

2. In Claude Code, add this server to your settings:
```json
{
  "mcpServers": {
    "comp-ai-mcp": {
      "command": "node",
      "args": ["/path/to/this/repo/dist/index.js"]
    }
  }
}
```

3. Configure your TryComp.ai API credentials using Claude Code:
```sh
configure my comp ai mcp server with api key your_api_key_here and org id org_abc123def456
```

Note: This config will be valid as long as the session is valid.

## Running with Cursor

1. Install the MCP extension in Cursor if available, or configure manually
2. Add the server to your Cursor MCP settings:
```json
{
  "mcpServers": {
    "comp-ai-mcp": {
      "command": "node",
      "args": ["/path/to/this/repo/dist/index.js"]
    }
  }
}
```

3. Restart Cursor and configure API credentials as needed

## Available Tools

### Configuration
- **configure-trycomp** - Configure API key and organization ID for subsequent requests

### Organization Management
- **get-organization-information** - Get organization details
- **update-organization** - Update organization information
- **delete-organization** - Delete an organization

### People & Members
- **get-all-people** - Get all people in organization
- **create-member** - Create a new team member
- **get-person-by-id** - Get person details by ID
- **update-member** - Update member information
- **delete-member** - Remove a member
- **add-multiple-members** - Bulk add members to organization

### Risk Management
- **get-all-risks** - Get all organizational risks
- **create-risk** - Create a new risk entry
- **get-risk-by-id** - Get risk details by ID
- **update-risk** - Update risk information
- **delete-risk** - Remove a risk

### Vendor Management
- **get-all-vendors** - Get all vendors
- **create-vendor** - Create a new vendor
- **get-vendor-by-id** - Get vendor details by ID
- **update-vendor** - Update vendor information
- **delete-vendor** - Remove a vendor

### Context & Knowledge Base
- **get-all-context-entries** - Get all context entries
- **create-context-entry** - Create new context entry
- **get-context-entry-by-id** - Get context entry by ID
- **update-context-entry** - Update context entry
- **delete-context-entry** - Remove context entry

### Policy Management
- **get-all-policies** - Get all policies (use pagination for large datasets)
- **create-policy** - Create a new policy
- **get-policy-by-id** - Get policy details by ID
- **update-policy** - Update policy information
- **delete-policy** - Remove a policy

### Task Management
- **get-all-tasks** - Get all tasks with optional filtering
- **get-task-by-id** - Get task details by ID
- **get-task-attachments** - Get attachments for a task
- **upload-attachment-to-task** - Upload file to task
- **get-task-attachment-download-url** - Get download URL for attachment
- **delete-task-attachment** - Remove task attachment

### Device Management
- **get-all-devices** - Get all devices in organization
- **get-devices-by-member-id** - Get devices for specific member

### Comments & Collaboration
- **get-comments-for-entity** - Get comments for any entity
- **create-comment** - Create new comment with optional attachments
- **update-comment** - Update comment content
- **delete-comment** - Remove a comment

### Attachments
- **get-attachment-download-url** - Get download URL for attachments

### Device Agents
- **download-macos-device-agent** - Download macOS monitoring agent
- **download-windows-device-agent** - Download Windows monitoring agent

### Health & Monitoring
- **health-check** - Check API server health status

For detailed API documentation, visit: [CompAI API Reference Docs](https://trycomp.ai/docs/api-reference/organization/get-organization-information)

## Note

This MCP server may collect usage analytics to help improve the service. By using this server, you consent to anonymous usage tracking.
