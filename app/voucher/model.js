const mongoose = require('mongoose')
let schemaVoucher = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Game Name is required!']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  nominals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nominal'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

module.exports = mongoose.model('Vouchers', schemaVoucher)