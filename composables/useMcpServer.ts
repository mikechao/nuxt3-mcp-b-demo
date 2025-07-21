import { TabServerTransport } from "@mcp-b/transports";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod";

export const useMcpServer = async () => {
  console.log('creating MCP server instance in composable')
  const server = new McpServer({
    name: 'mcp-server-composable',
    version: '1.0.0',
  })

    server.tool('sayHello', 'Says hello', {
      name: z.string()
    }, async ({ name }) => ({
      content: [{ type: 'text', text: `Hello ${name}!` }]
    }));

    console.log('First tool defined, connecting transport...');
    await server.connect(new TabServerTransport({ allowedOrigins: ['*'] }));
    console.log('Transport connected...');

  return {
    server
  }
}