import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js'
import adminRouter from './routes/adminRouter.js'
dotenv.config()

const app = express()


app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'SmartHelp AI Backend is running' })
})

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});