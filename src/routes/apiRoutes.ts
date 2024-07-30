import { Router, Request, Response } from "express";
import { login } from "../controllers/AuthController";
import { main } from "../controllers/MainController";
import { wh, admin } from "../controllers/WHController";
import { runProducer } from "../workers/Producer";
const router = Router();

router.post("/process", main);
router.post("/login", login);
router.post("/webhook", wh);
router.get("/admin/:process", admin);
router.get("/status", async (req: Request, res: Response) => {
  res.json({ success: true, git: "test" });
});
router.get("/hello", async (req: Request, res: Response) => {
  const message = "Hello Kafka";
  ///const correlationId = await runProducer(message);
  res.json({ success: true });
});

export default router;
