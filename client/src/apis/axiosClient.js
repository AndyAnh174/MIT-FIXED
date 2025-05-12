import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  //baseURL: process.env.REACT_APP_SERVER_URL,

  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: param => queryString.string,
  withCredentials: true,
});

export default axiosClient;
