import { Router, Request, Response } from "express";
import { main } from "../controllers/MainController";

const router = Router();

router.post("/process", main);

export default router;
