import { Router, Request, Response } from "express";
import { main } from "../controllers/MainController";
import { login } from "../controllers/AuthController";

const router = Router();

router.post("/process", main);
router.post("/login", login);

export default router;
