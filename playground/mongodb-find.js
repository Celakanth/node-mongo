//const MongoClient = require('mongodb').MongoClient;
//De-structured object
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();

//console.log(obj);

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

  db.collection('Users').find(
    {
      name: 'Chriian'
    }).toArray().then( (docs) => {
      if (docs.length > 0) {
        console.log(`Found the following ${docs.length} Users`);
        console.log(JSON.stringify(docs, undefined, 2));
      }
      else{
        console.log('No data matching your search was found');
      }
  }, (err) => {
    console.log('Unable to fetch Todos', err);
  })

  //db.close();
});
//0239462497
