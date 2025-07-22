import Sessions from '../models/session.js'

async function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uId
  // console.log('Cookies: ', userUid)

  // Validating Session Uid
  if (!userUid) {
    // console.log('Invalid Session Uid')
    return res.status(401).redirect('/user/signin')
  }

  const user = await Sessions.findOne({ uId: userUid })
  if (!user) {
    // console.log('Invalid User')
    return res.status(401).redirect('./user/signin')
  }

  // console.log('User: ', user)
  // console.log('Authentication Successfull...')
  req.sessionInfo = user
  next()
}

async function checkAuth(req, res, next) {
  // console.log('check Auth: ', req.url, req.method)
  const userUid = req.cookies?.uId

  if (userUid) {
    const user = await Sessions.findOne({ uId: userUid })
    if (user) {
      // Only redirect GET requests to signin/signup pages when user is already logged in
      if (
        req.method === 'GET' &&
        (req.url.includes('/signin') || req.url.includes('/signup'))
      ) {
        // console.log(
        //   'User already logged in, redirecting to dashboard'
        // )
        return res.redirect('/url')
      }
    } else {
      // Invalid session, clear the cookie
      res.clearCookie('uId')
    }
  }
  next()
}

export { restrictToLoggedInUserOnly, checkAuth }
