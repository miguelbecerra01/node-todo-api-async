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



//get
app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });

});


//get by id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID Not Valid');
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({ todo });

    }, (err) => {
        return res.status(400).send();
    }).catch((e) => {
        return res.status(400).send();
    });
});


//delete
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }, (err) => {
        return res.status(400).send();
    }).catch((e) => {
        console.log('ERROR', e);
    });
});


//update
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    //from the body sent we extract only the fields that are going to update
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,
        { $set: body },
        { new: true }
    ).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        //console.log('Updated', body);
        res.send({ todo });

    }).catch((e) => {
        return res.status(400).send();
    });



});

//Users

//POST 

app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);
    /*var user = new User({
        email: body.email,
        password: body.password
    });*/

    user.save().then(() => {
        //we update the user with the token in the db
        return user.generateAuthToken();
    }).then((token) => {
        //send the token with header
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        //  console.log(e);
        res.status(400).send(e);
    });

});


//GET users/me uses authenticate middleware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


//POST users/login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    if (!body.email) {
        return res.status(400).send('email cannot be empty');
    }
    if (!body.password) {
        return res.status(400).send('password cannot be empty');
    }

    User.findByCredentials(body.email, body.password).then((user) => {
        //if there is an error catch will catch it.
        return user.generateAuthToken().then((token) => {
            //send the token with header
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });

})

app.delete('/users/me/token', authenticate, (req, res) => {
    
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (e) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Started in port ${port}`);
});
module.exports = { app };






