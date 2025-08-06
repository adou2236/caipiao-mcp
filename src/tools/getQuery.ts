import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"
import type {Tool} from "fastmcp";
import {z} from "zod";

const URL = `https://api.jisuapi.com/caipiao/query?appkey=${API_KEY}`

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

const getQuery = (caipiaoid: string, issueno?: string) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL, {caipiaoid, issueno})

const queryTool: Tool<any, any> = {
  name: "get_query",
  description: "获取彩票的开奖信息",
  parameters: z.object({
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
  }),
  execute: async ({caipiaoid, issueno}) => {
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
}
export default queryTool

