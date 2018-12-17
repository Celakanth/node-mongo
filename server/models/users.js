/*
  Users.js
*/
const _ = require('lodash');
const validate = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

var {salt} = require('./../config/salt');


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
  var token = jwt.sign({_id: user._id.toHexString(), access}, salt).toString();
  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decode;

  try {
    decode = jwt.verify(token, salt);

  } catch (e) {
      return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // var userInfo = user.toObject();
          // var newUser = _.pick(userInfo,['_id', 'email', 'tokens[0].token']);
          resolve(user);
        }
        else {
          reject(err);
        }
      });
    });
  })
};

UserSchema.pre('save', function(next){
  var user = this;

  if (user.isModified('password')) {
     bcrypt.genSalt(10,(err, salt) => {
       bcrypt.hash(user.password, salt, (err, hash) => {
         user.password = hash;
         next();
       });
     });
  }
  else {
    next();
  }
})

var Users = mongoose.model('Users',UserSchema);

module.exports = {Users};
