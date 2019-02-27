require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

//middleware to tell the format received
app.use(bodyParser.json());

//Post 
app.post('/todos', authenticate, async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    try {
        const doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});



//get
app.get('/todos', authenticate, async (req, res) => {
    try {
        //get todos made by the loged in user
        const todos = await Todo.find({ _creator: req.user._id });
        res.send({ todos });
    } catch (err) {
        res.status(400).send(err);
    }
});


//get by id
app.get('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send('ID Not Valid');
        }

        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({ todo });
    } catch (err) {
        res.status(400).send();
    }
});


//delete
app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        const todo = await Todo.findOneAndDelete({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    } catch (e) {
        res.status(400).send();
    }
});


//update
app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;

        //from the body sent we extract only the fields that are going to update
        const body = _.pick(req.body, ['text', 'completed']);

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        },
            { $set: body },
            { new: true }
        );

        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });

    } catch (err) {
        res.status(400).send();
    }
});

//Users

//POST 
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        /*var user = new User({
            email: body.email,
            password: body.password
        });*/
        await user.save();
        //we update the user with the token in the db
        const token = user.generateAuthToken();
        //send the token with header
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    };
});


//GET users/me uses authenticate middleware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


//POST users/login
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);

        if (!body.email) {
            return res.status(400).send('email cannot be empty');
        }
        if (!body.password) {
            return res.status(400).send('password cannot be empty');
        }

        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();

        //send the token with header
        res.header('x-auth', token).send(user);

    } catch (e) {
        res.status(400).send(e);
    };

})

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});


app.listen(port, () => {
    console.log(`Started in port ${port}`);
});
module.exports = { app };






