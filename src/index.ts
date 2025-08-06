import { FastMCP } from "fastmcp";
import classTool from "./tools/getClass.js";
import historyTool from "./tools/getHistory.js";
import queryTool from "./tools/getQuery.js";
import winningTool from "./tools/getWinning.js";

const server = new FastMCP({
  name: "caipiao",
  version: "1.0.0",
});

server.addTool(classTool);
server.addTool(historyTool);
server.addTool(queryTool);
server.addTool(winningTool);

async function main() {
  // await server.start({
  //   transportType: "stdio",
  // });
  await server.start({
    transportType: "httpStream",
    httpStream: {
      port: 8080,
    },
  });
  console.error("Caipiao MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

export default server
