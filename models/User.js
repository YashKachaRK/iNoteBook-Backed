const mongoose = require('mongoose')
const {Schema} = mongoose
const userSchema = new mongoose.Schema({
  // create user in database 



  name: {
    type: String,
    required: true
  },

  emailid: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// using userSchema  'user' table name
const User = mongoose.model('user', userSchema)
module.exports= User