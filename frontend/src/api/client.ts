import axios from "axios";

export const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:9527/api";

const client = axios.create({ baseURL });

export default client;
