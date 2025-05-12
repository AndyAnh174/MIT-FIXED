import express from "express";
import CodeController from "../controllers/compiler.controller";

const router = express.Router();

router.post("/code/debug", CodeController.debug);
router.post("/code/compile", CodeController.compile);

export default router;
