const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  id: { type: String },
  prefix: { type: String },
  language: { type: String }
})

module.exports = mongoose.model('guilds', schema)
