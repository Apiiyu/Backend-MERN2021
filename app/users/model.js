const mongoose = require('mongoose')
let schemaUsers = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email is required!']
  },
  name: {
    type: String,
    require: [true, 'Name is required!']
  },
  password: {
    type: String,
    require: [true, 'Password is required!']
  },
  phoneNumber: {
    type: String,
    require: [true, 'Phone Number is required!']
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'Admin'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Users', schemaUsers)