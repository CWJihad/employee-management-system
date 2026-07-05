import express from "express";
import cors from "cors";
import multer from "multer";
import authRouter from "./routes/auth.route.js";
import employeeRouter from "./routes/employee.route.js";
import profileRouter from "./routes/profile.route.js";
import attendanceRouter from "./routes/attendance.route.js";
import LeaveApplicationRouter from "./routes/leave.application.route.js";
import payslipRouter from "./routes/payslip.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get("/", (req, res) => res.send("server is running"));
app.use('/api/auth', authRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/profile', profileRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/leave', LeaveApplicationRouter)
app.use('/api/payslip', payslipRouter)
app.use('/api/dashboard', dashboardRouter)

export default app