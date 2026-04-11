import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import ticketRoutes from './routes/ticketRoutes.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.use("/uploads", express.static("uploads"))

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Make io accessible to routes
app.set('io', io)

const PORT = process.env.PORT || 4002

app.use("/api/tickets", ticketRoutes)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('joinTicket', (ticketId) => {
    const room = `ticket-${ticketId}`
    socket.join(room)
    console.log(`User joined room: ${room}`)
  })

  socket.on('leaveTicket', (ticketId) => {
    const room = `ticket-${ticketId}`
    socket.leave(room)
    console.log(`User left room: ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Ticket service running on port ${PORT}`)
})