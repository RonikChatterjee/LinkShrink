import express from 'express'
const router = express.Router()

// Importing Middlewares
import { restrictToLoggedInUserOnly } from '../middlewares/authMiddleware.js'

// Importing the Url Controllers
import {
  handleGetUserDashBoard,
  handleCreateShortUrl,
  handleRedirectShortUrl,
  handleDeleteUser,
} from '../controllers/urlController.js'

router.use(restrictToLoggedInUserOnly)
router
  .route('/')
  .get(handleGetUserDashBoard)
  .post(handleCreateShortUrl)

router.route('/:shortId').get(handleRedirectShortUrl)

router.route('/delete/:id').delete(handleDeleteUser)

export default router
