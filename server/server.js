// only server will listen and connect DB
import app from './src/app.js'
import {PORT} from './src/config/config.js'
import connectDB from './src/config/database.js'


connectDB()

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
