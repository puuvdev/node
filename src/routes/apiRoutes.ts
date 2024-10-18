import { Router, Request, Response } from "express";
import { main } from "../controllers/MainController";
import { login, register } from "../controllers/AuthController";

const router = Router();

router.post("/process", main);
router.post("/login", login);
router.post("/register", register);

export default router;
