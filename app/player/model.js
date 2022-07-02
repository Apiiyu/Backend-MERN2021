const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const HASH_ROUND = bcrypt.genSaltSync(10)

let schemaPlayer = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email is required!']
  },
  name: {
    type: String,
    require: [true, 'Name is required!'],
    minLength: [3, 'Length name is 3 - 225 Character'],
    maxLength: [225, 'Length name is 3 - 225 Character'],
  },
  username: {
    type: String,
    require: [true, 'Username is required!'],
    minLength: [3, 'Length username is 3 - 225 Character'],
    maxLength: [225, 'Length username is 3 - 225 Character'],
  },
  phoneNumber: {
    type: String,
    require: [true, 'Phone Number is required!'],
    minLength: [10, 'Phone Number is 10 - 225 Character'],
    maxLength: [13, 'Phone Number is 3 - 225 Character'],
  },
  password: {
    type: String,
    require: [true, 'Password is required!'],
    minLength: [5, 'Length username minimal 5 Character'],
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  avatar: {
    type: String,
  },
  filename: {
    type: String
  },
  favorite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
}, {
  timestamps: true
})

schemaPlayer.path('email').validate(async (value) => {
  try {
    const count = await mongoose.model('Player').countDocuments({email: value})
    return !count
  } catch (error) {
    throw error
  }
}, attrribute => `${attrribute.value} has already registered!`)

schemaPlayer.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND)
  next()
})

module.exports = mongoose.model('Player', schemaPlayer)