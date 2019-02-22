const { ObjectID } = require('mongodb');

const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'useroneemail@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'usertwoemail@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];


const todos = [
    {
        _id: new ObjectID,
        text: 'First Todo',
        completed: true,
        completedAt: 213,
        _creator: userOneId
    }, {
        _id: new ObjectID,
        text: 'Second Todo',
        completed: false,
        completedAt: 213,
        _creator: userTwoId
    }];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        //Promise.all waits until all promises (save) are made then continues runing the execution
        //then gets called when all the promises put in the array are done
        //with return popup the promise to the other function...(like below)
        return Promise.all([userOne, userTwo])
    }).then(() => {
        done();
    });
};

module.exports = { todos, populateTodos, users, populateUsers };
