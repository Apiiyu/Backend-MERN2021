const mongoose = require('mongoose')
let schemaPayment = mongoose.Schema({
  type: {
    type: String,
    require: [true, 'Type of Payment is required!'],
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  banks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  }]
}, 
{
  timestamps: true
})

module.exports = mongoose.model('Payment', schemaPayment)