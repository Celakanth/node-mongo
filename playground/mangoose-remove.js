/*
  mangoose-remove.js

  Samples of deletes for mongo db;
*/
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');

// Todo.remove({}).then((resault) => {
//   console.log(resault);
// });
//
// Todo.findOneAndRemove({}).then({
//
// });

Todo.findByIdAndRemove('5c13abbd3586bdad079cb7f1').then(() =>{

});
