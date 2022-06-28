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
  isFeatured: {
    type: Boolean,
    default: false
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
    ref: 'Users'
  },
  payments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }
},{
  timestamps: true
})

module.exports = mongoose.model('Vouchers', schemaVoucher)