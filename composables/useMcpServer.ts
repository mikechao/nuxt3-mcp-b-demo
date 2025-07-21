import { TabServerTransport } from "@mcp-b/transports";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod";

// Global singleton instance
let serverInstance: McpServer | null = null;
let serverPromise: Promise<McpServer> | null = null;

export const useMcpServer = async () => {
  // Return existing instance if already created
  if (serverInstance) {
    console.log('returning existing MCP server instance')
    return { server: serverInstance };
  }

  // Return existing promise if server is being created
  if (serverPromise) {
    console.log('waiting for MCP server instance to be created')
    const server = await serverPromise;
    return { server };
  }

  // Create new instance
  console.log('creating MCP server instance in composable')
  serverPromise = (async () => {
    const server = new McpServer({
      name: 'mcp-server-composable',
      version: '1.0.0',
    });

    server.tool('sayHello', 'Says hello', {
      name: z.string()
    }, async ({ name }) => ({
      content: [{ type: 'text', text: `Hello ${name}!` }]
    }));

    console.log('First tool defined, connecting transport...');
    await server.connect(new TabServerTransport({ allowedOrigins: ['*'] }));
    console.log('Transport connected...');

    serverInstance = server;
    return server;
  })();

  const server = await serverPromise;
  return { server };
}