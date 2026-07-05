import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/", authMiddleware, getDashboard);


export default dashboardRouter