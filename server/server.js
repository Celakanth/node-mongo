/*
  server.js
unix time is 1970 - less than 1970 + grater than 1970, every int is a second of time
*/

require('./config/config.js');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors');


//Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {Users} = require('./models/users');


const {authenticate} = require('./middleware/authenticate')


//Server routing
var app = express();

//Adding in body parser as middleware to express()

app.use(bodyParser.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//app.use(cors);

//Todo routes

//Test server is running 

app.get('/',(req,res) => {
  res.send("The server is fine")
});

//add a todo
app.post('/todos', authenticate, (req, res) =>{
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    _userCreator: req.user._id
  }, (e) => {
    res.status(400).send(e);
  });

  todo.save().then((doc) =>{
    res.send(doc);
  }, (e) =>{
    res.status(400).send(e);
  });
});

// Get Todo by ID
app.get('/todos/:id', authenticate, (req,res) => {
  //res.send(req.params);
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid id');
  }
  Todo.findById({
    _id:id,
    _userCreator: req.user._id
  }).then((todo) =>{
      if (!todo) {
        return res.status(404).send('The todo was not found!');
      }
      res.status(200).send(JSON.stringify(todo, undefined, 2));
  }).catch((e) => done(e));
});

//Get all Todos
app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _userCreator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((e) => done(e));
});

//Delete Todo()
app.delete('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid id');
  };

  Todo.findByIdAndRemove({
    _id:id,
    _userCreator: req.user._id
  }).then((todo) =>{
    if (!todo ) {
      return res.status(400).send('Todo could not be delted');
    }
    res.status(200).send({todo});
  }).catch((e) => done(e));
});


// Update a Todo
app.patch('/todos/:id', authenticate, (req,res) => {
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
  Todo.findByIdAndUpdate({
    _id:id,
    _userCreator: req.user._id
  },
  {$set: body},
  {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send('The id not found');
    }
    res.status(200).send({todo})
  }).catch((e) => {
      res.status(400).send(e);
  });
});

//-----------------------End Todos routes--------------------------

//User routes



//Authenticate a user
app.get('/user/me', authenticate, (req,res) => {
    res.send(req.user);
});

//User login
app.post('/users/login', (req,res) => {
  console.log(req);
    var body = _.pick(req.body, ['email', 'password'])
    Users.findByCredentials(body.email, body.password).then((user) => {
      //res.header('x-auth',user.tokens[0].token).send(user);
      return user.gerenateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
      });
    }).catch((e) =>{
      res.status(400).send(e);
    });
});

//Log a user routes

app.delete('/user/me/token',authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch(() =>{
     res.this.status(400).send();
  });
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






//-----------------------End User routes-------------------------


app.listen(process.env.PORT, () =>{
  console.log(`Server started on port ${process.env.PORT}`);
});

module.exports = {app};
