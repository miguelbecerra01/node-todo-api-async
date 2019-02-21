var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');

var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var app = express();

//middleware to tell the format received
app.use(bodyParser.json());

//Post 
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
      //  console.log('saved \n', doc);
    }, (err) => {
        res.status(400).send(err);
    });
});


app.listen(3000, () => {
    console.log('Started in port 3000');
});



module.exports = { app };






/*
var newTodo = new Todo({
    text: ' sa ',
    completed: true
});

newTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save todo', err);
});




var newUser = new User({
    email: '   email@mail.com'
});

newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save the user', err);
});
*/



