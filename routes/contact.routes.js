const { Router } = require('express')
const Contact = require('../models/Contact')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/add', auth, async (req, res) => {
  try {
    const { name, phone } = req.body
    const existing = await Contact.findOne({ phone })

    if (existing) {
      return res
        .status(500)
        .json({ message: `This number already used`, name: existing.name })
    }

    const contact = new Contact({
      name,
      phone,
      owner: req.user.userId,
    })

    await contact.save()
    res.status(201).json({ contact, message: 'Contact created', ok: true })
  } catch (error) {
    res.status(500).json({ message: 'Something goes wrong' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.userId })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ message: 'Something goes wrong' })
  }
})

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    res.json({ message: 'Contact deleted', ok: true })
  } catch (error) {
    res.status(500).json({ message: 'Something goes wrong' })
  }
})

router.put('/update/:id', auth, async (req, res) => {
  try {
    const { name, phone } = req.body

    const existing = await Contact.findOne({ phone })

    if (existing && existing._id === req.params.id) {
      return res
        .status(500)
        .json({ message: `This number already used`, name: existing.name })
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      name && phone && { name, phone }
    )

    res.json({ message: 'Contact updated', ok: true })
  } catch (error) {
    if (error.codeName === 'DuplicateKey') {
      res.status(500).json({ message: 'This number already used' })
    } else {
      res.status(500).json({ message: 'Something goes wrong :(' })
    }
  }
})

module.exports = router
