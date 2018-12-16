/*
  Users.js
*/
const _ = require('lodash');
const validate = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
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
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      required: true
    }
  }],
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

//override user data responce

UserSchema.methods.toJSON = function (){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


//Create token on a user
UserSchema.methods.gerenateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'celakanth').toString();
  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
    return token;
  });
}

var Users = mongoose.model('Users',UserSchema);

module.exports = {Users};
