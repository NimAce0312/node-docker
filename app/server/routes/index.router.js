import { Router } from "express";
import authRouter from "./auth.route.js";
import templateRouter from "./template.route.js";

const indexRouter = new Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/templates", templateRouter);

export default indexRouter;
