import mongoose from 'mongoose'

const payslipSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    }

}, {timestamps: true})

const payslipModel = mongoose.model('payslip', payslipSchema)

export default payslipModel