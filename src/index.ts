import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import getClass from "./tools/getClass.js";
import getQuery from "./tools/getQuery.js";
import getHistory from "./tools/getHistory.js";
import getWinning from "./tools/getWinning.js";

const server = new McpServer({
  name: "caipiao",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});




interface Class {
  caipiaoid: string//彩票ID
  name:	string	// 名称
  parentid: number//	上级ID
  nextopentime:	string	//下期开奖时间
  nextbuyendtime:	string	//下期截止购买时间
  lastissueno:	string	//本期期号（已开奖的最新期号）
  nextissueno:	string	//下期期号
}

function formatClass(feature: Class): string {
  return [
    `彩票id: ${feature.caipiaoid || "Unknown"}`,
    `彩票名称: ${feature.name || "Unknown"}`,
    `上级ID: ${feature.parentid || "Unknown"}`,
    `下期开奖时间: ${feature.nextopentime || "Unknown"}`,
    `下期截止购买时间: ${feature.nextbuyendtime || "Unknown"}`,
    `本期期号: ${feature.lastissueno || "No headline"}`,
    `下期期号: ${feature.nextissueno || "No headline"}`,
    "---",
  ].join("\n");
}

interface Prize {
  prizename:	string	//奖项
  require:	string	//中奖条件
  num:	number	//中奖人数
  singlebonus:	string	//单注金额
}
interface Caipiao {
  caipiaoid: string //彩票ID
  issueno:	string	//期号
  number:	string	//彩票号码 红球
  refernumber:	string	//彩票剩余号码 蓝球
  opendate:	string	//开奖日期
  deadline:	string	//兑奖截止日期
  saleamount:	string	//销售额
  prize: Array<Prize> //中奖信息
}

function formatPrize(item: Prize): string {
  return [
    `${item.prizename || "Unknown"}:${item.require}`,
    `中奖注数: ${item.num || "Unknown"}`,
    `单注金额: ${item.singlebonus + "元"  || "Unknown"}`,
    "---",
  ].join("\n")
}

function formatCaipiao(item: Caipiao): string {
  return [
    `${item.issueno || "Unknown"}期的中奖号码是:${item.number}+${item.refernumber}`,
    `开奖日期是: ${item.opendate || "Unknown"}`,
    `兑奖截止日期是: ${item.deadline || "Unknown"}`,
    `总销售额是: ${item.saleamount + "元"  || "Unknown"}`,
    "---",
    `中奖情况为: ${item.prize.map(formatPrize)}`,
    "---",
  ].join("\n")
}

interface Winning {
  caipiaoid: string //彩票ID
  winnumber: string // 当期中奖号码 红球
  winrefernumber: string // 当期中奖剩余号码 蓝球
  issueno:	string	//期号
  winstatus:	number	//中奖状态 0中奖 1未中奖
  list: Array<Prize>
  prizename:	string	//奖项名称
  require:	string	//奖项条件
  singlebonus:	string	//单注奖金
}

function formatWinning(item: Winning): string {
  return [
    `${item.issueno || "Unknown"}期的中奖号码是:${item.winnumber}+${item.winrefernumber}`,
    `是否中奖: ${item.winstatus === 0 ? "中奖" : "未中奖"}`,
    "---",
    `中奖情况为: ${item.list.map(formatPrize)}`,
    "---",
  ].join("\n")
}




server.tool(
  "get_class",
  "获取彩票的所有分类",
  async () => {
    let res = await getClass()
    const {status, result, msg} = res || {status: -1, msg: "请求失败"}
    if(status !== 0){
      return {
        content: [
          {
            type: "text",
            text: msg,
          },
        ],
      }
    }
    const formattedClasses = result.map(formatClass);
    const classesTxt = `彩票分类有:\n\n${formattedClasses.join("\n")}`;
    return {
      content: [
        {
          type: "text",
          text: classesTxt
        }
      ]
    }
  },
);

server.tool(
  "get_query",
  "获取彩票的开奖信息",
  {
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
  },
  async ({caipiaoid, issueno}) => {
    let res = await getQuery(caipiaoid, issueno)
    const {status, result, msg} = res || {status: -1, msg: "请求失败"}
    if(status !== 0){
      return {
        content: [
          {
            type: "text",
            text: msg,
          },
        ],
      }
    }
    const formattedTxt = formatCaipiao(result);
    return {
      content: [
        {
          type: "text",
          text: formattedTxt
        }
      ]
    }
  },
);

server.tool(
  "get_history",
  "获取彩票的历史开奖信息",
  {
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
    num: z.number().optional().default(10).describe("分页查询的数量"),
    start: z.number().optional().default(0).describe("分页查询的起始位置"),
  },
  async ({caipiaoid, issueno, num, start}) => {
    let res = await getHistory(caipiaoid, issueno, num, start)
    const {status, result, msg} = res || {status: -1, msg: "请求失败"}
    if(status !== 0){
      return {
        content: [
          {
            type: "text",
            text: msg,
          },
        ],
      }
    }
    return {
      content: [
        {
          type: "text",
          text: typeof result === 'string' ? result : JSON.stringify(res, null, 2)
        }
      ]
    }
  },
);

server.tool(
  "get_winning",
  "查询我的号码的中奖情况",
  {
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
    number: z.string().describe("我的彩票号码 (红球)"),
    refernumber: z.string().optional().describe("我的剩余彩票号码 (蓝球)"),
    type: z.enum(["1", "2", "3"]).optional().describe("投注类型 1直选 2组三 3组六"),
  },
  async ({caipiaoid, issueno, number, refernumber, type}) => {
    let res = await getWinning(caipiaoid, number, refernumber, issueno, type)
    const {status, result, msg} = res || {status: -1, msg: "请求失败"}
    if(status !== 0){
      return {
        content: [
          {
            type: "text",
            text: msg,
          },
        ],
      }
    }
    console.error(result)
    const formattedTxt = formatWinning(result);
    return {
      content: [
        {
          type: "text",
          text: formattedTxt
        }
      ]
    }
  },
);



async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Caipiao MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
