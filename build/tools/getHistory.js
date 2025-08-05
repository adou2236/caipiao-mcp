import { API_KEY } from "../utils/index.js";
import makeNWSRequest from "../utils/index.js";
const URL = `https://api.jisuapi.com/caipiao/history?appkey=${API_KEY}`;
const getHistory = (caipiaoid, issueno, num, start) => makeNWSRequest(URL, { caipiaoid, issueno, num, start });
export default getHistory;
