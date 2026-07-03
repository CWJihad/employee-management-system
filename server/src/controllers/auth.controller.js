// login for employee and admin

import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/config.js"

const login = async (req, res) => {
    try {
        const {email, password, role_type} = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not found!"
            })
        }

        if (role_type === "admin" && user.role !== "ADMIN" ) {

            return res.status(401).json({
                success: false,
                message: "Not authorized as admin"
            })
            
        }

        if (role_type === "employee" && user.role !== "EMPLOYEE" ) {

            return res.status(401).json({
                success: false,
                message: "Not authorized as employee"
            })
            
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            
            return res.status(402).json({
                success: false,
                message: "Invalid credentials!"
            })
            
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email
        }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
        {expiresIn: "7d"})

        return res.status(202).json({
            success: true,
            message: "User successfully login",
            user: payload,
            token
        })
        
    } catch (error) {
        console.error('Login error', error);
        return res.status(500).json({
            error: "Login failed!"
        })
        
    }
}


const session = (req, res) => {

    const session = req.session

    return res.json({user: session})
    
}


const changePassword = async (req, res) => {
    
    try {
        
        const session = req.session
        const {currentPassword, newPassword} = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both field are required"
            })
        }

        const user = await userModel.findById(session.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isValid = await bcrypt.compare(currentPassword, user.password)

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect!"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        return res.status(202).json({
            success: true,
            message: "Password successfully changed",
        })
        
    } catch (error) {

        return res.status(500).json({
            error: "Failed to change password"
        })
        
    }
    
}


export {
    login,
    session,
    changePassword
}
