import axios from "axios";
import queryString from "query-string";

const axiosFile = axios.create({
  // baseURL: process.env.REACT_APP_SERVER_URL,
  baseURL: process.env.REACT_APP_SERVER_URL_PRODUCTION,
  headers: { "content-type": "multipart/form-data" },
  paramsSerializer: param => queryString.string,
  withCredentials: true,
});

const fileApi = {
  upload(data) {
    return axiosFile.post("/api/files", data);
  },
};

export default fileApi;
