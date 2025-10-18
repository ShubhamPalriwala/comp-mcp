# Comp AI MCP Server

MCP server for the Comp AI GRC platform. Manage risks, vendors, policies, tasks, and compliance workflows directly from Claude or any MCP-compatible client.

## Installation

You'll need Node.js 18 or later and a Comp AI API key from your organization settings.

```bash
npm install
npm run build
```

## Configuration

Add the server to your MCP client settings. For Claude Code, update your configuration:

```json
{
  "mcpServers": {
    "comp-ai-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/comp-mcp/dist/index.js"]
    }
  }
}
```

For Cursor, add the same configuration to your MCP settings and restart the editor.

Once connected, configure your credentials in the chat:

```
configure my comp ai mcp server with api key sk_... and org id org_...
```

The credentials remain active for your session.

## What You Can Do

This server gives you access to the full Comp AI platform through natural language:

**Risks** - Create, update, filter, and track organizational risks. Manage treatment strategies and risk scoring.

**Vendors** - Handle third-party vendor assessments, track risk levels, and manage vendor lifecycles.

**Policies** - Create and maintain organizational policies with structured content and versioning.

**Tasks** - Query compliance tasks, filter by assignee or status, and manage attachments.

**Evidence Collection** - Set up automated evidence gathering for compliance tasks.

**Trust Portal** - Publish or unpublish your security posture to external stakeholders.

**Team Management** - Add members, track devices, and manage organizational structure.

**Comments** - Add context to any entity with threaded discussions and attachments.

The server includes built-in prompts for common workflows like risk analysis and evidence collection. Ask Claude to "analyze my critical risks" or "set up evidence automation" to get started.

## Resources

The server exposes useful resources you can reference:

- `risk-categories` - Valid risk category types
- `risk-statuses` - Risk lifecycle states
- `impact-levels` - Risk impact classifications
- `likelihood-levels` - Risk probability ratings

## Documentation

Visit the [Comp AI API docs](https://trycomp.ai/docs/api-reference) for detailed endpoint information.

## Privacy

This server collects anonymous usage data to improve functionality with [Agnost AI](https://agnost.ai). Usage is tracked when you interact with Comp AI resources through the MCP server.
