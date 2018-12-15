/*
  mangoose-queries.js

  Samples of quiries for mongo db;
*/

const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');


var id = '5c0a47d488bcf8c1bcade9f0';

if (!ObjectID.isValid(id)) {
  console.log('The id is not a valid id');
  return;
}

Todo.find({
  _id: id
}).then((todos) => {
  if (todos.length === 0) {
    console.log('No todo found matching the id');
    return;
  }
  console.log('All Todoos',JSON.stringify(todos, undefined, 2));
}, (e) => {
  console.log(e);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  if (!todo) {
    console.log('No todo found matching the id');
    return;
  }
  console.log('Todo find one',JSON.stringify(todo, undefined, 2));
}, (e) => {
  console.log(e);
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    console.log('No todo found matching the id');
    return;
  }
  console.log('Todo by id', JSON.stringify(todo, undefined, 2));
}, (e) => {
  console.log(e);
});
