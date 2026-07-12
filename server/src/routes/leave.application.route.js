import {Router} from "express"
import {adminMiddleware, authMiddleware} from '../middlewares/auth.middleware.js'
import { createLeave, getLeaves, updateLeaveStatus } from '../controllers/leave.application.controller.js'

const LeaveApplicationRouter = Router()

LeaveApplicationRouter.post('/', authMiddleware, createLeave)
LeaveApplicationRouter.get('/', authMiddleware, getLeaves)
LeaveApplicationRouter.put('/:id', authMiddleware, adminMiddleware, updateLeaveStatus)

export default LeaveApplicationRouter