import Urls from '../models/url.js'
import { Users } from '../models/user.js'
import { customAlphabet } from 'nanoid'

async function handleGetUserDashBoard(req, res) {
  // Getting user id from the user object which was inserted by the check Auth Middleware
  const userId = req.sessionInfo.userId
  try {
    // Showing all urls created by the specified user
    const allUrls = await Urls.find({ createdBy: userId })
    return res.render('dashboard', {
      urls: allUrls,
      user: await Users.findById(userId),
    })
  } catch (err) {
    console.log(`Error in getting urls from DB: ${err}`)
  }
}

async function handleCreateShortUrl(req, res) {
  const body = req.body
  if (!body.url) {
    return res.status(400).json({ error: 'No url Provided...' })
  }

  const userId = req.sessionInfo.userId
  try {
    const userInfo = await Users.findById(userId)
    // checking wheather the redirect url present in DB or not
    const url = await Urls.findOne({
      redirectUrl: body.url,
    })
    if (!url) {
      // RedirectUrl is not present in the DB
      const nanoid = customAlphabet('1234567890abcdef', 8)
      const shortId = nanoid()
      await Urls.create({
        shortUrl: shortId,
        redirectUrl: body.url,
        visitedHistory: [],
        createdBy: userId,
      })
      const allUrls = await Urls.find({ createdBy: userId })
      return res.status(201).render('dashboard', {
        urls: allUrls,
        shortId: `https://linkshrink.up.railway.app/url/${shortId}`,
        user: userInfo,
      })
    } else {
      // RedirectUrl is present in the DB
      // Checking that the RedirectUrl createdBy user(userId) present or not
      const entry = await Urls.findOne({
        redirectUrl: body.url,
        createdBy: userId,
      })
      if (!entry) {
        // RedirectUrl createdBy user(userId) not present
        await Urls.create({
          shortUrl: url.shortUrl,
          redirectUrl: url.redirectUrl,
          visitedHistory: [],
          createdBy: userId,
        })
        res.status(201)
      } else {
        // RedirectUrl createdBy user(userId) present
        res.status(200)
      }
      const allUrls = await Urls.find({ createdBy: userId })
      return res.render('dashboard', {
        urls: allUrls,
        shortId: `https://linkshrink.up.railway.app/url/${url.shortUrl}`,
        user: userInfo,
      })
    }
  } catch (err) {
    console.log(`Error in getting urls from DB: ${err}`)
  }
}

async function handleRedirectShortUrl(req, res) {
  const shortId = req.params.shortId

  if (!shortId) {
    return res.status(400).json({ error: 'No url Provided...' })
  }

  const userId = req.sessionInfo.userId
  try {
    const entry = await Urls.findOneAndUpdate(
      { shortUrl: shortId, createdBy: userId },
      { $push: { visitedHistory: { timestamp: Date.now() } } }
      // { new: true } // Returns the document after updation
    )

    if (!entry) {
      return res.status(404).json({ error: 'Invali Url...' })
    }

    return res.status(200).redirect(entry.redirectUrl)
  } catch (err) {
    console.log(`Error in redirecting: ${err}`)
  }
}

async function handleDeleteUser(req, res) {
  const userId = req.params.id
  await Urls.findByIdAndDelete(userId)
  return res.status(200).end()
}

export {
  handleGetUserDashBoard,
  handleCreateShortUrl,
  handleRedirectShortUrl,
  handleDeleteUser,
}
