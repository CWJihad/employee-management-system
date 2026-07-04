import mongoose from "mongoose";

const LeaveApplicationSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    type: {
        type: String,
        enum: ["SICK", "CASUAL", "ANNUAL"],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    }

}, {timestamps: true})

const LeaveApplicationModel = mongoose.model("LeaveApplication", LeaveApplicationSchema)

export default LeaveApplicationModel