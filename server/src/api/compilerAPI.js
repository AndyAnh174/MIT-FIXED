import axiosClient from "./axiosClient";

const compilerAPI = {
  debug(data, name) {
    return axiosClient.post("/api/code/debug", {
      data,
      _id: name,
    });
  },
  compile(data, name, input) {
    return axiosClient.post("/api/code/compile", {
      data,
      _id: name,
      input,
    });
  },
};

export default compilerAPI;
