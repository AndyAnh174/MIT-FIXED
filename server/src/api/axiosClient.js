import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.SERVER_COMPILER_URL,
  //baseURL: "http://localhost:3334",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: param => queryString.string,
  withCredentials: true,
});

export default axiosClient;
