const mongoose = require('mongoose')

const BrandName = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  dimensions: {
    height: Number,
    width: Number
  },
  images: [String] ,
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('brandname', BrandName)
