import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"
import { z } from "zod";
import type {Tool} from "fastmcp"

const URL = `https://api.jisuapi.com/caipiao/class?appkey=${API_KEY}`


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


const getClass = () =>
  makeNWSRequest<{ status: number, msg: string, result: any }>(URL)
const classTool: Tool<any, any> = {
  name: "get_class",
  description: "获取彩票的所有分类",
  parameters: z.object({
    caipiaoid: z.string().describe("彩票类型id"),
    issueno: z.string().optional().default("").describe("期号 (不填默认是当前期)"),
  }),
  execute: async () => {
    let res = await getClass()
    const {status, result, msg} = res || {status: -1, msg: "请求失败"}
    if (status !== 0) {
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
}

export default classTool
