import {Router} from 'express'
import { getProfile, updateProfile } from '../controllers/profile.controller.js'

const profileRouter = Router()

profileRouter.get('/', getProfile)
profileRouter.post('/', updateProfile)

export default profileRouter