import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["PRESENT", "ABSENT", "LATE"],
        default: "PRESENT"
    },
    workingHours: {
        type: Number,
        default: null
    },
    dayType: {
        type: String,
        enum: ["FUll Day", "Three Quarter Day", "Half Day", "Short Day", null]
    }

}, {timestamps: true})

attendanceSchema.index({employee: 1, date: 1}, {unique: true})

const attendanceModel = mongoose.model('attendance', attendanceSchema)

export default attendanceModel