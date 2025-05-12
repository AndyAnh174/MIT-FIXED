import jwt from "jsonwebtoken";

import AuthService from "../services/auth.service";
import sockets from "../sockets";

const AuthController = {};

AuthController.login = async (req, res) => {
  const result = await AuthService.login(
    req.body.username,
    req.body.password,
  );

  if (result) {
    const players = sockets.io.playersOnline;
    if (
      players.find(player => player.username === req.body.username)
    ) {
      return res.status(405).json({
        message: "Username already exists",
      });
    }

    const token = jwt.sign(
      {
        userId: result._id,
        username: result.username,
        displayName: result.displayName,
        role: result.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res
      .status(200)
      .cookie("access_token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        access_token: token,
        displayName: result.displayName,
        role: result.role,
      });
  } else {
    res.status(403).json({
      message: "Login failed",
    });
  }
};

AuthController.logout = async (req, res) => {
  res.status(200).clearCookie("access_token").json({
    message: "Logout success",
  });
};

export default AuthController;
