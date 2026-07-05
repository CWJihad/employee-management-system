import { DEPARTMENTS } from "../constants/departments.js";
import attendanceModel from "../models/attendance.model.js";
import employeeModel from "../models/employee.model.js";
import LeaveApplicationModel from "../models/leave.application.model.js";
import payslipModel from "../models/payslip.model";

export const getDashboard = async (req, res) => {
  try {
    const session = req.session;
    if ((session.role = "ADMIN")) {
      const [totalEmployees, todayAttendance, pendingLeaves] =
        await Promise.all([
          employeeModel.countDocuments({ isDeleted: { $ne: true } }),
          attendanceModel.countDocuments({
            date: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          }),
          LeaveApplicationModel.countDocuments({ status: "PENDING" }),
        ]);

      return res.status(201).json({
        success: true,
        message: "Admin dashboard fetched successfully",
        role: "ADMIN",
        totalEmployees,
        totalDepartments: DEPARTMENTS.length,
        todayAttendance,
        pendingLeaves,
      });
    } else {
      const employee = await employeeModel
        .findOne({
          userId: session.userId,
        })
        .lean();

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found!",
        });
      }

      const today = new Date();
      const [currentMonthAttendance, pendingLeaves, latestPayslip] =
        await Promise.all([
          attendanceModel.countDocuments({
            employeeId: employee._id,
            date: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
              $gte: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
          }),

          LeaveApplicationModel.countDocuments({
            employeeId: employee._id,
            status: "PENDING",
          }),

          payslipModel
            .findOne({ employeeId: employee._id })
            .sort({ createAt: -1 })
            .lean(),
        ]);

      return res.status(201).json({
        success: true,
        message: "Employee dashboard fetched successfully",
        role: "EMPLOYEE",
        employee: {
            ...employee,
            id: employee._id.toString()
        },
        currentMonthAttendance,
        pendingLeaves,
        latestPayslip: latestPayslip ? {...latestPayslip, id: latestPayslip._id.toString()} : null
      });
    }
  } catch (error) {
    console.error("Dashboard error: ", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
