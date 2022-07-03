const mongoose = require('mongoose')
let schemaTransaction = mongoose.Schema({
  historyVoucherTopUp: {
    gameName: {
      type: String,
      require: [true, 'Game Name is required!']
    },
    category: {
      type: String,
      require: [true, 'Category is required!']
    },
    thumbnail: {
      type: String,
    },
    coinName: {
      type: String,
      require: [true, 'Coin Name is required!']
    },
    coinQuantity: {
      type: Number,
      require: [true, 'Coin Quantity is required!']
    },
    price: {
      type: Number,
      require: [true, 'Price is required!']
    }
  },

  historyPayment: {
    name: {
      type: String,
      require: [true, 'Name is required!']
    },
    type: {
      type: String,
      require: [true, 'Type of Payment is required!']
    },
    bankName: {
      type: String,
      require: [true, 'Bank Name is required!']
    },
    accountNumber: {
      type: String,
      require: [true, 'Account Number is required!']
    },
  },

  name: {
    type: String,
    require: [true, 'Name is required!'],
    minLength: [3, 'Length name is 3 - 225 Character'],
    maxLength: [225, 'Length name is 3 - 225 Character'],
  },

  accountUser: {
    type: String,
    require: [true, 'Name Account is required!'],
    minLength: [3, 'Length name is 3 - 225 Character'],
    maxLength: [225, 'Length name is 3 - 225 Character'],
  },

  tax: {
    type: Number,
    default: 0
  },

  value: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['Success', 'Pending', 'Failed'],
    default: 'Pending'
  },

  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  historyUser: {
    name: {
      type: String,
      require: [true, 'History User is required!']
    },

    phoneNumber: {
      type: String,
      require: [true, 'Phone Number is required!'],
      minLength: [10, 'Phone Number is 3 - 225 Character'],
      maxLength: [13, 'Phone Number is 3 - 225 Character'],
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transactions', schemaTransaction)