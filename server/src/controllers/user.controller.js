import UserService from "../services/user.service";

const UserController = {};

UserController.createNewAccount = async (req, res) => {
  const result = await UserService.createNewAccount(
    req.body.username,
    req.body.password,
    req.body.displayName,
    req.body.role,
  );

  if (result) {
    res.status(200).json({
      message: "Create new account success",
    });
  } else {
    res.status(401).json({
      message: "Create new account failed",
    });
  }
};

UserController.deleteAccount = async (req, res) => {
  const result = await UserService.deleteAccount(req.body.username);

  if (result) {
    res.status(200).json({
      message: "Delete account success",
    });
  } else {
    res.status(401).json({
      message: "Delete account failed",
    });
  }
};

export default UserController;
