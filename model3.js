const mongoose = require('mongoose')

let Post = new mongoose.Schema({
   images: [String] ,
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date,  default: Date.now }
})

module.exports = mongoose.model('Post', Post)
