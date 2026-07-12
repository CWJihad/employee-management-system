import { inngest } from "../inngest/index.js"
import employeeModel from "../models/employee.model.js"
import LeaveApplicationModel from "../models/leave.application.model.js"


const createLeave = async (req, res) => {
    
    try {

        const session = req.session
        const employee = await employeeModel.findOne({userId: session.userId})

        if (!employee) {
            
            return res.status(404).json({
                success: false,
                message: "Employee not found!"
            })
            
        }

        if (employee.isDeleted) {
            
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated!"
            })
            
        }

        const {type, startDate, endDate, reason} = req.body

        if (!type || !startDate || !endDate || !reason) {

            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })

        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (new Date(startDate) <= today || new Date(endDate) <= today) 
        {
            
            return res.status(401).json({
                success: false,
                message: "Leave date is not valid!"
            })
            
        }

        if (new Date(endDate) < new Date(startDate)) 
        {
            
            return res.status(401).json({
                success: false,
                message: "End date is not valid!"
            })
            
        }

        const leave = await LeaveApplicationModel.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING"
        })

        await inngest.send({
                name: "leave/pending",
                data: {
                    leaveApplicationId: leave._id
                }
              })

        return res.status(202).json({
            success: true,
            message: "Leave application successful",
            data: leave
        })

    } catch (error) {

        return res.status(500).json({
            error: "Leave application failed! "
        })
        
    }
    
}


const getLeaves = async (req, res) => {
    
    try {

        const session = req.session
        const isAdmin = session.role === "ADMIN"

        if (isAdmin) {
            
            const status = req.query.status
            const where = status ? {status} : {}
            const leaves = await LeaveApplicationModel.find(where).populate("employeeId").sort({createdAt: -1})
            const data = leaves.map((l) => {
                const obj = l.toObject()

                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString()
                }
            })

            return res.status(200).json({
                success: true,
                message: "Admin Successfully fetched employees leaves data",
                data
            })
            
        } else {

            const employee = await employeeModel.findOne({
                userId: session.userId
            }).lean()

            if (!employee) {
                
                return res.status(404).json({
                    success: false,
                    message: "Employee not found!"
                })
                
            }

            const leaves = await LeaveApplicationModel.find({
                employeeId: employee._id
            }).sort({createdAt: -1})

            return res.status(200).json({
                success: true,
                message: "Employee successfully got his leaves data",
                data: leaves,
                employee: {...employee, id: employee._id.toString()}
            })

            
        }
        
    } catch (error) {
        console.error('Get leaves Error:', error);
        
        return res.status(500).json({
            success: false,
            error: error.message
        })
        
    }
    
}


const updateLeaveStatus = async (req, res) => {
    
    try {

        const {status} = req.body
        if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            
            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            })
            
        }

        const leave = await LeaveApplicationModel.findByIdAndUpdate(req.params.id, {status}, {returnDocument: "after"})

        return res.status(201).json({
            success: true,
            message: "Leave status updated successfully",
            data: leave
        })
        
    } catch (error) {

        return res.status(500).json({
            error: "Leave status failed to update!"
        })
        
    }
    
}

export {
    createLeave,
    getLeaves,
    updateLeaveStatus
}













