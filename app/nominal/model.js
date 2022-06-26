const mongoose = require('mongoose')
let schemaNominal = mongoose.Schema({
  coinName: {
    type: String,
    require: [true, 'Coin Name is required!']
  },
  coinQuantity: {
    type: Number,
    default: 0
  }, 
  price: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Nominal', schemaNominal)