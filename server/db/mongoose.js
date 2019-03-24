/*
  mongoose.js
*/
var mongoose = require('mongoose');
// set mongoose promise.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exportes = {mongoose};
