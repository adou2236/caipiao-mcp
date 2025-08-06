import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"
import type {Tool} from "fastmcp";
import {z} from "zod";

const URL = `https://api.jisuapi.com/caipiao/winning?appkey=${API_KEY}`


function formatPrize(item: Prize): string {
  return [
    `${item.prizename || "Unknown"}:${item.require}`,
    `中奖注数: ${item.num || "Unknown"}`,
    `单注金额: ${item.singlebonus + "元"  || "Unknown"}`,
    "---",
  ].join("\n")
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
const getWinning =
  (caipiaoid: string, number: string, refernumber?: string, issueno?: string, type?: TYPE) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL,  {caipiaoid, issueno, number, refernumber, type})


const winningTool: Tool<any, any> = {
  name: "get_winning",
  description: "查询我的号码的中奖情况",
  parameters: z.object({
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
    number: z.string().describe("我的彩票号码 (红球)"),
    refernumber: z.string().optional().describe("我的剩余彩票号码 (蓝球)"),
    type: z.enum(["1", "2", "3"]).optional().describe("投注类型 1直选 2组三 3组六"),
  }),
  execute: async ({caipiaoid, issueno, number, refernumber, type}) => {
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
}
export default winningTool
