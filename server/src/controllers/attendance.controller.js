import { inngest } from "../inngest/index.js";
import attendanceModel from "../models/attendance.model.js";
import employeeModel from "../models/employee.model.js";

const clockInOUt = async (req, res) => {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee is not found!",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated!",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await attendanceModel.findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();

    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

      const attendance = await attendanceModel.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });

      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id,
          attendanceId: attendance._id
        }
      })

      return res.status(201).json({
        success: true,
        type: "CHECK_IN",
      });
    } else if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diffMs = now.getTime - checkInTime;
      const diffHours = diffMs / (60 * 60 * 1000);

      existing.checkOut = now;

      const workingHours = parseFloat(diffHours.toFixed(2));
      let dayType = "";
      if (workingHours >= 8) return (dayType = "Full Day");
      else if (workingHours >= 6) return (dayType = "Three Quarter Day");
      else if (workingHours >= 4) return (dayType = "Half Day");
      else dayType = "Short Day";

      existing.workingHours = workingHours;
      existing.dayType = dayType;

      await existing.save();

      return res.status(201).json({
        success: true,
        type: "CHECK_OUT",
        data: existing,
      });
    } else {
      return res.status(201).json({
        success: true,
        type: "CHECK_OUT",
        data: existing,
      });
    }
  } catch (error) {
    console.error("Attendance Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Check In/Out Operation failed!",
    });
  }
};

const getAttendance = async (req, res) => {
  try {

    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee is not found!",
      });
    }

    const limit = parseInt(req.query.limit || 30)
    const history = await attendanceModel.find({employeeId: employee._id}).sort({date: -1}).limit(limit)

    return res.status(201).json({
        success: true,
        data: history,
        employee: {isDeleted: employee.isDeleted}
    })


  } catch (error) {

    return res.status(500).json({
      success: false,
      error: "Failed to fetch attendance!",
    });
  }

};


export {
    clockInOUt,
    getAttendance
}


