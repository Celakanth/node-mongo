/*
  Users.js
*/

var mongoose = require('mongoose');

var Users = mongoose.model('Users',{
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
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
