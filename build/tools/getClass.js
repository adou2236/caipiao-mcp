import { API_KEY } from "../utils/index.js";
import makeNWSRequest from "../utils/index.js";
const URL = `https://api.jisuapi.com/caipiao/class?appkey=${API_KEY}`;
const getClass = () => makeNWSRequest(URL);
export default getClass;
