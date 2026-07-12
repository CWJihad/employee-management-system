import {Router} from "express"
import { changePassword, login, session } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/session', authMiddleware, session)
authRouter.put('/change-password', authMiddleware, changePassword)

export default authRouter

