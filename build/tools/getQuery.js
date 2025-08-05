import { API_KEY } from "../utils/index.js";
import makeNWSRequest from "../utils/index.js";
const URL = `https://api.jisuapi.com/caipiao/query?appkey=${API_KEY}`;
const getQuery = (caipiaoid, issueno) => makeNWSRequest(URL, { caipiaoid, issueno });
export default getQuery;
