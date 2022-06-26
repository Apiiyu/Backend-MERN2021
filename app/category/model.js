const mongoose = require('mongoose')
let schemaCategory = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name category is required']
  }
},{
  timestamps: true
})

module.exports = mongoose.model('Category', schemaCategory)