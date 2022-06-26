const mongoose = require('mongoose')
let schemaBank = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required!'],
  },
  bankName: {
    type: String,
    require: [true,'Bank Name is required!']
  },
  accountNumber: {
    type: String,
    require: [true, 'Account Number is required!']
  }
},{
  timestamps: true
})

module.exports = mongoose.model('Bank', schemaBank)