import mongoose from 'mongoose'

const urlSchema = mongoose.Schema(
  {
    shortUrl: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitedHistory: [{ timestamp: Number }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

const urlModel = new mongoose.model('url', urlSchema)

export default urlModel
