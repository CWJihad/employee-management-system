import employeeModel from "../models/employee.model.js"
import payslipModel from "../models/payslip.model.js"



const createPayslip = async (req, res) => {
    
    try {

        const {employeeId, month, year, basicSalary, allowances, deductions} = req.body

        if (!employeeId || !month || !year || !basicSalary) {
            
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
            
        }

        const netSalary = Number(basicSalary) + Number (allowances || 0) - Number(deductions || 0)

        const payslip = await payslipModel.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary
        })

        return res.status(202).json({
            success: true,
            message: "Payslip created successfully",
            data: payslip
        })
        
    } catch (error) {

        return res.status(500).json({
            error: "Failed to create payslip!!"
        })
        
    }
    
}

const getPayslips = async (req, res) => {
    
    try {

        const session = req.session
        const isAdmin = session.role === "ADMIN"

        if (isAdmin) {
            
            const payslip = await payslipModel.find().populate("employeeId").sort({createdAt: -1})

            const data = payslip.map((p) => {

                const obj = p.toObject()

                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString()
                }
                
            })

            return res.status(201).json({
                success: true,
                message: "Employee payslips fetched successfully",
                data
            })
            
        } else {

            const employee = await employeeModel.findOne({
                userId: session.userId
            })

            if (!employee) {
                
                return res.status(404).json({
                    success: false,
                    message: "Employee not found!"
                })
                
            }

            const payslip = await payslipModel.find({
                employeeId: employee._id
            }).sort({createdAt: -1})

            return res.status(201).json({
                success: true,
                message: "Your payslips fetched successfully",
                data: payslip
            })
            
        }
        
    } catch (error) {

        return res.status(500).json({
            error: "Failed to fetch payslips!!"
        })
        
    }
    
}

const getPayslipById = async (req, res) => {
    
    try {

        const payslip = await payslipModel.findById(req.params.id).populate("employeeId").lean()

        if (!payslip) {
            
            return res.status(404).json({
                success: false,
                message: "Not Found!",
            })
            
        }

        const result = {
            ...payslip,
            id: payslip._id.toString(),
            employee: payslip.employeeId
        }

        return res.status(201).json({
            success: true,
            message: "Payslip fetched successfully with id",
            data: result
        })
        
    } catch (error) {

        return res.status(500).json({
            error: "Failed to fetch payslips with Id!!"
        })
        
    }
    
}

export {
    createPayslip,
    getPayslips,
    getPayslipById,
}






