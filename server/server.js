/*
  server.js
unix time is 1970 - less than 1970 + grater than 1970, every int is a second of time
*/

const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

//Local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');

//Global setting
var PORT = 3000;

//Server routing
var app = express();

//Adding in body parser as middleware to express()

app.use(bodyParser.json());

//add a todo
app.post('/todos', (req, res) =>{
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  }, (e) => {
    res.status(400).send(e);
  });

  todo.save().then((doc) =>{
    res.send(doc);
  }, (e) =>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) => {
  //res.send(req.params);
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid id');
  }
  Todo.findById(id).then((todo) =>{
      if (!todo) {
        return res.status(404).send('The todo was not found!');
      }
      res.status(200).send(JSON.stringify(todo, undefined, 2));
  }, (e) => {
    return res.status(400).send('Something went wrong');
  })
});


app.get('/todos', (req,res) => {
  Todo.find().then((doc) => {
    res.send({doc});
  }, (e) => {
    res.status(400).send(e)
  })
});

//Get a value from a query string



app.listen(PORT, () =>{
  console.log(`Server started on port ${PORT}`);
});

module.exports = {app};
