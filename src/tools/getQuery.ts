import {API_KEY} from "../utils/index.js";
import makeNWSRequest from "../utils/index.js"

const URL = `https://api.jisuapi.com/caipiao/query?appkey=${API_KEY}`

const getQuery = (caipiaoid: string, issueno?: string) =>
  makeNWSRequest<{status: number, msg: string, result: any}>(URL, {caipiaoid, issueno})
export default getQuery
