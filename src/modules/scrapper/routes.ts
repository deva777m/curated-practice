import { Router } from "express";
import { jwtAuthenticate } from "../../utils/middlewares/auth";
import handler from "./handlers";

const router = Router();

router.use(jwtAuthenticate);

router.get("/", handler.get);

export default router;