import { Router } from "express";
import handler from "./handlers";

const router = Router();

router.get("/", handler.get);

router.post("/", handler.post);

export default router;