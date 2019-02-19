//const MongoClient = require('mongodb').MongoClient;
//destructuring, extract a property of a module and make it a variable.
const {MongoClient, ObjectID} = require('mongodb');

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

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));

    });

    //insert a user
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
    });

    client.close();
});