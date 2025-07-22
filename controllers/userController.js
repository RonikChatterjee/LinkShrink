import { Users } from '../models/user.js'
import Sessions from '../models/session.js'
import { v7 as uuidv7 } from 'uuid' // For generating Session Unique Id
import { hashPassword, comparePassword } from '../utils/hashing.js' // For hashing the password

function handleGetSignup(req, res) {
  return res.render('signup')
}

function handleGetSignin(req, res) {
  return res.render('signin')
}

async function handlePostSignup(req, res) {
  if (!req.body) {
    return res.redirect('/user/signup?error=missing_data')
  }

  const { name, email, password } = req.body

  // Validate required fields
  if (!name || !email || !password) {
    return res.redirect('/user/signup?error=missing_data')
  }

  try {
    const user = await Users.findOne({ email: email })
    if (user) {
      // console.log({ Error: `Email already exists...` })
      return res.redirect('/user/signup?error=email_exists')
    } else {
      await Users.create({
        name: name,
        email: email,
        password: await hashPassword(password),
      })
      // console.log({ status: `Registration Successful` })
    }
    return res.redirect('/user/signin?success=registered')
  } catch (err) {
    console.log('Signup error:', err)
    return res.redirect('/user/signup?error=server_error')
  }
}

async function handlePostSignin(req, res) {
  // Validating req.body
  if (!req.body) {
    return res.redirect('/user/signin?error=missing_data')
  }

  // Destructuring req.body
  const { email, password } = req.body

  // console.log(`email: ${email} | password: ${password}`)
  // console.log(`Sign in attempt for email: ${email}`)

  try {
    // Finding user with specified email
    const user = await Users.findOne({ email: email })
    // Validating user
    if (!user) {
      // User has not registered -> Sign in not possible
      // console.log('User not found:', email)
      return res.redirect('/user/signin?error=user_not_found')
    }

    // Matching the user given password with hashed password in DB
    if (await comparePassword(password, user.password)) {
      // Matched : true
      // Creating Session Unique Id
      const sessionUid = uuidv7()
      // Mapping sessionUid with respective userId in Sessions DB
      await Sessions.create({
        uId: sessionUid,
        userId: user._id,
      })
      // console.log({
      //   status: `Logged in successfully for user: ${email}`,
      // })
      // Adding the sessionUid into the cookies of user
      return res.cookie('uId', sessionUid).redirect('/url')
    } else {
      // Password doesn't match
      // console.log('Password mismatch for user:', email)
      return res.redirect('/user/signin?error=invalid_password')
    }
  } catch (err) {
    console.error('Sign in error:', err)
    return res.redirect('/user/signin?error=server_error')
  }
}

async function handleUserLogout(req, res) {
  // console.log('Logged out successfully')
  const sessionUid = req.cookies?.uId
  await Sessions.findOneAndDelete({ uId: sessionUid })
  res.clearCookie('uId')
  res.status(200).redirect('/')
}

export {
  handleGetSignup,
  handleGetSignin,
  handlePostSignup,
  handlePostSignin,
  handleUserLogout,
}
