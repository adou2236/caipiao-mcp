import { API_KEY } from "../utils/index.js";
import makeNWSRequest from "../utils/index.js";
const URL = `https://api.jisuapi.com/caipiao/winning?appkey=${API_KEY}`;
const getWinning = (caipiaoid, number, refernumber, issueno, type) => makeNWSRequest(URL, { caipiaoid, issueno, number, refernumber, type });
export default getWinning;
