import express from 'express'

const router = express.Router()
// Importing Middlewares
import { checkAuth } from '../middlewares/authMiddleware.js'

// Importing User Controller
import {
  handleGetSignup,
  handleGetSignin,
  handlePostSignup,
  handlePostSignin,
  handleUserLogout,
} from '../controllers/userController.js'
router
  .route('/signup')
  .get(checkAuth, handleGetSignup)
  .post(checkAuth, handlePostSignup)
router
  .route('/signin')
  .get(checkAuth, handleGetSignin)
  .post(checkAuth, handlePostSignin)
router.route('/logout').post(handleUserLogout)

export default router
