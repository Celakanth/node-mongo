//const MongoClient = require('mongodb').MongoClient;
//De-structured object
const {MongoClient, ObjectID} = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server!');
  }

  console.log('Connected to MongoDB server');

  //DeleteMany
  // db.collection('Todos').deleteMany({text : "Finish your studies"}).then((result) => {
  //   console.log(result);
  // });
  //DeleteOne
  // db.collection('Todos').deleteOne({text : "Clean the office"}).then((result) => {
  //   console.log(result);
  // });

  //FindOneandDelete
  db.collection('Todos').findOneAndDelete({completed : false}).then((result) => {
    console.log(result);
  });
//db.close();

});

//0239462497
