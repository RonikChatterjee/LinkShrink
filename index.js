import express from 'express'
const app = express()

import dotenv from 'dotenv'
// Seting the location or path of the .env file
dotenv.config({
  path: './.env',
})

// const PORT = 7000
const PORT = process.env.PORT || 7000

// Connecting to  Database
import connectDB from './Database/index.js'
connectDB()
  .then(() => console.log(`🗄️  Database: Connected to MongoDB`))
  .catch(err => console.log(`DB connection error: ${err}`))

// Setting view engine
import path from 'path'
app.set('view engine', 'ejs')
// path.resolve(''): Provides absolute path of the specified dir or file
app.set('views', path.resolve('./views'))

// Middleware
// Importing Middlewares
import cookieParser from 'cookie-parser'
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
import staticRouter from './routes/staticRoutes.js'
import userRouter from './routes/userRoutes.js'
import urlRouter from './routes/urlRoutes.js'
app.use('/', staticRouter)
app.use('/user', userRouter)
app.use('/url', urlRouter)

app.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('🚀 LOGIN FORM SERVER STARTED')
  console.log('='.repeat(50))
  console.log(`📡 Port: ${PORT}`)
  console.log(`🌐 URL: https://linkshrink.up.railway.app:${PORT}`)
  console.log('='.repeat(50))
})
