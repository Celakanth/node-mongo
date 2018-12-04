//const MongoClient = require('mongodb').MongoClient;
//De-structured object

const {MongoClient, ObjectID} = require('mongodb');


/*
var user = {name: 'christian', age: 43}
var {name} = user;

console.log(name);
*/


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server!');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'This is a new todo 1' ,
  //   complete: false
  // }, (err, result) => {
  //   if (err) {
  //     db.close();
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Christian Tester',
  //   age: 43,
  //   location: 'Wales',
  //   active: true
  // }, (err, results) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //
  //   console.log(JSON.stringify(results.ops[0]._id.getTimestamp(), undefined, 2));
  // })

  db.close();
});
