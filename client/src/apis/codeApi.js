import axiosClient from "./axiosClient";

const codeApi = {
  debug(data) {
    return axiosClient.post("/api/code/debug", {
      data,
    });
  },
  compile(data, input) {
    return axiosClient.post("/api/code/compile", {
      data,
      input,
    });
  },
};

export default codeApi;
