import 'dotenv/config.js'
import connectDB from './src/config/database.js'
import { ADMIN_EMAIL } from './src/config/config.js'
import userModel from './src/models/user.model.js'
import bcrypt from 'bcrypt'

const TemporaryPassword = 'admin123'

async function registerAdmin() {

    try {
        
        const admin_email = ADMIN_EMAIL

        if (!admin_email) {
            console.error('Missing ADMIN_EMAIL env variable');
            process.exit(1)
        }

        connectDB()

        const existingAdmin = await userModel.findOne({email: admin_email})

        if (existingAdmin) {
            console.log('User already exists as role', existingAdmin.role);
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash(TemporaryPassword, 10)

        const admin = await userModel.create({
            email: admin_email,
            password: hashedPassword,
            role: "ADMIN"
        })

        console.log("Admin user cerated");
        console.log("\nemail: ", admin.email);
        console.log("password: ", TemporaryPassword);
        console.log("\nChange the password after login!");
        
        process.exit(0)
        
    } catch (error) {
        
        console.error("Seed failed: ", error);
        
    }
    
}

registerAdmin()