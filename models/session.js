import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    uId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

const sessionModel = new mongoose.model('session', sessionSchema)

export default sessionModel
