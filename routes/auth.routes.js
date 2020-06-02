const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      const isMatch = await bcrypt.compare(password, candidate.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' })
      }

      const token = jwt.sign(
        { userId: candidate.id },
        process.env.EXPRESS_JWTSECRET,
        {
          expiresIn: '10h',
        }
      )

      res.status(200).json({ token, userId: candidate.id })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    const token = jwt.sign({ userId: user.id }, process.env.EXPRESS_JWTSECRET, {
      expiresIn: '10h',
    })

    res
      .status(201)
      .json({ token, userId: user.id, message: 'User created successfully' })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
