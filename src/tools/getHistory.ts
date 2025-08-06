import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"
import type {Tool} from "fastmcp";
import {z} from "zod";
const URL = `https://api.jisuapi.com/caipiao/history?appkey=${API_KEY}`

const getHistory = (caipiaoid: string, issueno?: string, num?: number, start?: number) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL,  {caipiaoid, issueno, num, start})


const historyTool: Tool<any, any> = {
  name: "get_history",
  description: "获取彩票的历史开奖信息",
  parameters: z.object({
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
    num: z.number().optional().default(10).describe("分页查询的数量"),
    start: z.number().optional().default(0).describe("分页查询的起始位置"),
  }),
  execute: async ({caipiaoid, issueno, num, start}) => {
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
}
export default historyTool

