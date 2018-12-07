/*
  mongoose.js
*/
var mongoose = require('mongoose');
// set mongoose promise.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exportes = {mongoose};
