const { Schema, model, Types } = require('mongoose')

const scheme = new Schema({
  owner: { type: Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
})

module.exports = model('Contacts', scheme)
