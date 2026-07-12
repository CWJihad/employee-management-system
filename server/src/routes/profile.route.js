import {Router} from 'express'
import { getProfile, updateProfile } from '../controllers/profile.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const profileRouter = Router()

profileRouter.get('/',authMiddleware, getProfile)
profileRouter.post('/', authMiddleware, updateProfile)

export default profileRouter