#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const server = new Server(
  { name: "weather-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Get current weather for a city",
    inputSchema: {
      type: "object",
      properties: { city: { type: "string", description: "City name" } },
      required: ["city"]
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "get_weather") {
    return { content: [{ type: "text", text: `Weather in ${args.city}: Sunny, 72°F` }] };
  }
  return { content: [{ type: "text", text: "Unknown tool" }], isError: true };
});

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})().catch(console.error);
