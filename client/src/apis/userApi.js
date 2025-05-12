import axiosClient from "./axiosClient";

const userApi = {
  login(username, password) {
    return axiosClient
      .post("/api/login", {
        username,
        password,
      });
  },
};

export default userApi;
