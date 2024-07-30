import { Router, Request, Response } from "express";
import { login } from "../controllers/AuthController";
import { main } from "../controllers/MainController";

const router = Router();

router.post("/process", main);
router.post("/login", login);

router.get("/status", async (req: Request, res: Response) => {
  res.json({ success: true, git: "test" });
});

export default router;
