/*
  Users.js
*/
const validate = require('validator');
const mongoose = require('mongoose');

var Users = mongoose.model('Users',{
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true,
    validate:{
      validator: validate.isEmail,
      message:'Invalid email address'
    }
  },
  password:{
    type: String,
    minlength: 6,
    require: true,
    tokens: [{
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  },
  location: {
    type: String,
    required: false,
    default: null
  },
  active:{
    type: Boolean,
    required: false,
    default: true
  }
});

module.exports = {Users};
