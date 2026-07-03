import {Router} from "express"
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "../controllers/employee.controller.js"
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js"

const employeeRouter = Router()

employeeRouter.get('/', authMiddleware, adminMiddleware, getEmployees)
employeeRouter.post('/',  authMiddleware, adminMiddleware, createEmployee)
employeeRouter.put('/:id',  authMiddleware, adminMiddleware, updateEmployee)
employeeRouter.delete('/:id', authMiddleware, adminMiddleware, deleteEmployee)

export default employeeRouter