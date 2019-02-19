//const MongoClient = require('mongodb').MongoClient;
//destructuring, extract a property of a module and make it a variable.
const { MongoClient, ObjectID } = require('mongodb');

////////////////////
//extract objectid from mongodb
var obj = new ObjectID();
console.log(obj);
////////////////////

const url = 'mongodb://localhost:27017';

//database name
const dbName = 'TodoApp';

//connect using MonoClient
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongodb Server');
    }
    console.log('Connected to mongo db server');

    const db = client.db(dbName);

    var todos = [
        {
            text: 'Rest a bit',
            completed: false
        }, {
            text: 'Walk the dog',
            completed: true
        }, {
            text: 'Prepare for lunch',
            completed: false
        }, {
            text: 'Write some code',
            completed: true
        }, {
            text: 'Go outside',
            completed: true
        }, {
            text: 'Walk 30 min',
            completed: false
        }
    ];

    var todo = todos[Math.floor(Math.random() * todos.length)];

    db.collection('Todos').insertOne(todo, (err, result) => {
        if (err) {
            return console.log('Unable to insert Todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));

    });

    /*
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));

    });*/


    //insert a user
    var users = [
        {
            name: 'Michael',
            age: 61,
            location: 'London'
        }, {
            name: 'Antony',
            age: 55,
            location: 'Paris'
        }, {
            name: 'Miguel',
            age: 33,
            location: 'Chile'
        }, {
            name: 'Paula',
            age: 32,
            location: 'San Francisco'
        }, {
            name: 'Martin',
            age: 12,
            location: 'Moon'
        }
    ];

    //console.log(Math.floor(Math.random() * users.length));
    var user = users[Math.floor(Math.random() * users.length)];

    db.collection('Users').insertOne(user, (err, result) => {
        if (err) {
            return console.log('Unable to insert User', err);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    /*
        db.collection('Users').insertOne({
            name: 'Miguel Ant',
            age: 33,
            location: 'London'
        }, (err, result) => {
            if (err) {
                return console.log('Unable to insert User', err);
            }
            console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
            console.log(JSON.stringify(result.ops, undefined, 2));
        });*/

    client.close();
});