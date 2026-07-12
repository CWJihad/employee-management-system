import { eventType, Inngest } from "inngest";
import attendanceModel from "../models/attendance.model.js";
import employeeModel from "../models/employee.model.js";
import LeaveApplicationModel from "../models/leave.application.model.js";
import sendEmail from "../config/nodemailer.js";
import { template1, template2, template3 } from "../utils/email-template.js";
import { ADMIN_EMAIL } from "../config/config.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "emp-ms " });

// write your inngest functions
// auto check-out for employees
const autoCheckOut = inngest.createFunction(
  { id: "auto-check-out", triggers: [{ event: "employee/check-out" }] },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // wait for 9 hours
    await step.sleepUntil(
      "wait-for-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    );

    // get attendance data
    let attendance = await attendanceModel.findById(attendanceId);

    if (!attendance?.checkOut) {
      const employee = await employeeModel.findById(employeeId);

      // send reminder email
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: template1(employee, attendance),
      });

      // after 10 hours, mark attendance as checkout with status "LATE"
      await step.sleepUntil(
        "wait-for-1-hour",
        new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
      );

      attendance = await attendanceModel.findById(attendanceId);

      if (!attendance?.checkOut) {
        attendance.checkOut =
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
        attendance.workingHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";
        await attendance.save();
      }
    }
  },
);

// leave application reminder for admin
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: [{ event: "leave/pending" }] },

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // wait for 24 hours
    await step.sleepUntil(
      "wait-for-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );

    const leaveApplication =
      await LeaveApplicationModel.findById(leaveApplicationId);

    if (leaveApplication?.status === "PENDING") {
      const employee = await employeeModel.findById(
        leaveApplication.employeeId,
      );

      // send reminder email to admin to take action on leave application
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: "Leave Application Reminder",
        body: template2(employee, leaveApplication),
      });
    }
  },
);

// Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employees

const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: [{ cron: "TZ=Asia/Dhaka 30 11 * * *" }],
  }, // 06:00 UTC = 11:30 AM IST

  async ({ step }) => {
    // Step 1: Get today's date rage (IST)
    const today = await step.run("get-today-date", () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }) +
          "T00:00:00 + 06:00",
      );

      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

      return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
    });

    // Step 2: Get all active, non-deleted employees
    const activeEmployees = await step.run("get-active-employees", async () => {
      const employees = await employeeModel
        .find({
          isDeleted: false,
          employmentStatus: "ACTIVE",
        })
        .lean();

      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Get employee IDs on approved leave today
    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const leaves = await LeaveApplicationModel.find({
        status: "APPROVED",
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();

      return leaves.map((l) => l.employeeId.toString());
    });

    // Step 4: Get employee IDs who already checked in today
    const checkInIds = await step.run("check-in-ids", async () => {
      const attendances = await attendanceModel
        .find({
          date: { $gte: new Date(today.startUTC), $lt: new Date(today.endUTC) },
        })
        .lean();

      return attendances.map((a) => a.employeeId.toString());
    });

    // Step 5: Filter absent employees (not on leave & not checked in)

    const absentEmployees = activeEmployees.filter(
      (emp) => !onLeaveIds.includes(emp._id) && !checkInIds.includes(emp._id),
    );

    // step 6: send reminder emails
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        const emailPromises = absentEmployees.map((emp) => {
          // send email
          sendEmail({
            to: emp.email,
            subject: "Attendance Reminder - Please Mark Your Attendance",
            body: template3(emp),
          });
        });
        await Promise.all(emailPromises);
        return {emailSent: absentEmployees.length}
      });
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkIn: checkInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
];
