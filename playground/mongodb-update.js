//const MongoClient = require('mongodb').MongoClient;
//De-structured object
const {MongoClient, ObjectID} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server!');
  }

  console.log('Connected to MongoDB server');

  db.collection('Todos').findOneAndUpdate(
    {
      text: 'This is a new todo 1'
    },{
      $set : {
        completed: true
        }
      },{
        returnOriginal : false
      }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    });
//db.close();

});

//0239462497
