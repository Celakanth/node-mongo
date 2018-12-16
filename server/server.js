/*
  server.js
unix time is 1970 - less than 1970 + grater than 1970, every int is a second of time
*/

require('./config/config.js');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');


//Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {Users} = require('./models/users');

const {authenticate} = require('./middleware/authenticate')


//Server routing
var app = express();

//Adding in body parser as middleware to express()

app.use(bodyParser.json());

//Todo routes
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
  }).catch((e) => done(e));
});


app.get('/todos', (req,res) => {
  Todo.find().then((doc) => {
    res.send({doc});
  }).catch((e) => done(e));
});

//Delete Todo()
app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid id');
  };

  Todo.findByIdAndRemove(id).then((doc) =>{
    if (!doc ) {
      return res.status(400).send('Todo could not be delted');
    }
    res.status(200).send(JSON.stringify(doc,undefined, 2));
  }).catch((e) => done(e));
});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid id');
  };

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
    if (!doc) {
      return res.status(404).send('The id not found');
    }
    res.status(200).send(doc)})
    .catch((e) => {
      res.status(400).send(e);
  });
});




//-----------------------End Todos routes--------------------------

//User routes



//Authenticate a user
app.get('/user/me', authenticate, (req,res) => {
    res.send(req.user);
});


//Create Users
app.post('/user', (req,res) => {
  //var body = _.pick(req.body, ['email', 'password'])
  var user = new Users({
    email: req.body.email,
    password: req.body.password,
    active: true
  });
  user.save().then(() => {
    return user.gerenateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Get a user by email
app.get('/users/:email', (req,res) => {
  //res.send(req.params);
  var email = req.params.email;
  Todo.find({email}).then((user) =>{
      if (!user) {
        return res.status(404).send('The user was not found!');
      }
      res.status(200).send(JSON.stringify(user, undefined, 2));
  }).catch((e) => done(e));
});





//-----------------------End User routes-------------------------


app.listen(process.env.PORT, () =>{
  console.log(`Server started on port ${process.env.PORT}`);
});

module.exports = {app};
