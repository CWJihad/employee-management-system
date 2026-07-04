import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";
import { createPayslip, getPayslipById, getPayslips } from "../controllers/payslip.controller.js";

const payslipRouter = Router()

payslipRouter.post('/', authMiddleware, adminMiddleware, createPayslip)
payslipRouter.get('/', authMiddleware, getPayslips)
payslipRouter.get('/:id', authMiddleware, getPayslipById)

export default payslipRouter