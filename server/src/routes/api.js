import express from "express";
import multer from "multer";
import AuthController from "../controllers/auth.controller";
import CodeController from "../controllers/code.controller";
import FileController from "../controllers/file.controller";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const upload = multer({ dest: "images/" });

const router = express.Router();

router.post("/login", AuthController.login);
router.post(
  "/logout",
  AuthMiddleware.isAuthenticated,
  AuthController.logout,
);

if (process.env.NODE_ENV === "development") {
  router.post("/create-account", UserController.createNewAccount);
  router.delete("/delete-account", UserController.deleteAccount);
}

router.get("/", (req, res) => {
  res.json({
    message: "MIT UTE API",
  });
});

router.post(
  "/code/debug",
  AuthMiddleware.isAuthenticated,
  CodeController.debug,
);
router.post(
  "/code/compile",
  AuthMiddleware.isAuthenticated,
  CodeController.compile,
);

router.get(
  "/files/*",
  AuthMiddleware.isAuthenticated,
  FileController.getFile,
);

router.post(
  "/files",
  AuthMiddleware.isAuthenticated,
  // upload.single("image"),
  FileController.postFile,
);

export default router;
