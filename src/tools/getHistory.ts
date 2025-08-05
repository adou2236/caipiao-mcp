import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"
const URL = `https://api.jisuapi.com/caipiao/history?appkey=${API_KEY}`

const getHistory = (caipiaoid: string, issueno?: string, num?: number, start?: number) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL,  {caipiaoid, issueno, num, start})
export default getHistory
