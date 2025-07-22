import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Seting the location or path of the .env file
dotenv.config({
  path: './.env',
})

async function connectDB() {
  // For hosting
  const uri = process.env.MONGODB_URI
  return await mongoose.connect(uri)
}

export default connectDB
