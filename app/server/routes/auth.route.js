import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = new Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

export default authRouter;
