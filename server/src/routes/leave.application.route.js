import {Router} from "express"
import {adminMiddleware, authMiddleware} from '../middlewares/auth.middleware.js'
import { createLeave, getLeaves, updateLeaveStatus } from '../controllers/leave.application.controller.js'

const LeaveApplicationRouter = Router()

LeaveApplicationRouter.post('/', authMiddleware, createLeave)
LeaveApplicationRouter.post('/', authMiddleware, getLeaves)
LeaveApplicationRouter.post('/:id', authMiddleware, adminMiddleware, updateLeaveStatus)

export default LeaveApplicationRouter