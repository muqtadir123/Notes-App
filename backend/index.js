import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
  origin: ["http://localhost:5173", "https://notes-app-frontend-wheat.vercel.app"], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}))

// Enable pre-flight requests
app.options('*', cors())

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running" })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)

// Error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    // Start server only after MongoDB connection
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })
