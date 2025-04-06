import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
} from "../controllers/template.controller.js";
import { isAdmin, protectedRoute } from "../middlewares/auth.middleware.js";

const templateRouter = new Router();

templateRouter.get("/", getTemplates);

templateRouter.post("/", protectedRoute, isAdmin, createTemplate);

templateRouter.put("/:id", protectedRoute, isAdmin, updateTemplate);

templateRouter.delete("/:id", protectedRoute, isAdmin, deleteTemplate);

export default templateRouter;
