import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import ticketRoutes from './routes/ticketRoutes.js'

dotenv.config()

const app = express()

app.use("/uploads", express.static("uploads"))

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 4002

app.use("/api/tickets", ticketRoutes)
app.listen(PORT, () => {
  console.log(`Ticket service running on port ${PORT}`)
})