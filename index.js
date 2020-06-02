const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/contact', require('./routes/contact.routes'))

const PORT = process.env.EXPRESS_PORT || 5001

async function start() {
  try {
    await mongoose.connect(process.env.EXPRESS_MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => console.log(`app started ${PORT}`))
  } catch (error) {
    process.exit(1)
  }
}

start()
