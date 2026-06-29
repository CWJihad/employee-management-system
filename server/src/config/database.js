import mongoose from 'mongoose'
import {MONGO_URI} from './config.js'

async function connectDB() {
    try {
        await mongoose.connect(`${MONGO_URI}/employeeMS`)
        console.log('✅ connected to DB');
    } catch (error) {
        console.log('DB connection error: ', error.message);
        
    }
}

export default connectDB