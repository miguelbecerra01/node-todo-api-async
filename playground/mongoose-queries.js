//https://mongoosejs.com/docs/queries.html
const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '5c6e9615a6b94d3a3cd29735';

if (!ObjectID.isValid(id)) {
    return console.log('ID not valid');
}


//Find all, returns an array
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

//Returns only one that matches the search parameter
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

//Return an item by id
Todo.findById(id).then((todo) => {
    //if there arent todos
    if (!todo) {
        return console.log('Id not found');
    }

    console.log('Todo By ID', todo);
}).catch((e) => {
    console.log(e)
});

//Find a user
var userId = '5c6dce85e2d0af5af4baf912';

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not Found');
    }
    console.log('Find User by Id', user);
}, (err) => {
    console.log('Error Quering user', err);
});

