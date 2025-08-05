import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"

const URL = `https://api.jisuapi.com/caipiao/winning?appkey=${API_KEY}`
type TYPE = "1" | "2" | "3" | undefined
const getWinning =
  (caipiaoid: string, number: string, refernumber?: string, issueno?: string, type?: TYPE) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL,  {caipiaoid, issueno, number, refernumber, type})
export default getWinning
