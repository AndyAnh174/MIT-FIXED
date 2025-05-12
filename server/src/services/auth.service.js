import UserModel from "../models/user.model";

const AuthService = {};

AuthService.login = async (username, password) => {
  const result = await UserModel.findOne({
    username: username,
    password: password,
  });

  return result;
};

export default AuthService;
