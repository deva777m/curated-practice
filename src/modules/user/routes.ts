import { Router } from "express";
// import { Request, Response, NextFunction } from "express";
import { jwtAuthenticate } from "../../utils/middlewares/auth";
import handler from "./handlers";
// import AppError from "../../utils/AppError";

const router = Router();

router.get("/", jwtAuthenticate, handler.get);

router.post("/", handler.post);

router.get("/login", handler.login);

// router.get("/catch", handler.catch);

export default router;