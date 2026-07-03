import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { clockInOUt, getAttendance} from "../controllers/attendance.controller.js"

const attendanceRouter = Router()

attendanceRouter.post('/', authMiddleware, clockInOUt)
attendanceRouter.get('/', authMiddleware, getAttendance)

export default attendanceRouter






