const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const decoded = jwt.verify(token, process.env.EXPRESS_JWTSECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' })
  }
}
