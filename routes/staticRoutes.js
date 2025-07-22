import express from 'express'
const router = express.Router()

// Importing Middleware
import { checkAuth } from '../middlewares/authMiddleware.js'

// Importing Static Controllers
import { handleGetHomePage } from '../controllers/staticController.js'

router.route('/').get(checkAuth, handleGetHomePage)

export default router
