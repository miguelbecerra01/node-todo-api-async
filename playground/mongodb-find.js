const { MongoClient, ObjectID } = require('mongodb');
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

    //findAll
    db.collection('Todos').find().toArray().then((docs) => {
        console.log('Find All Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //Find by completed
    db.collection('Todos').find({ completed: true }).toArray().then((docs) => {
        console.log('Find todos by completed');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //Find by id
    db.collection('Todos').find({
        _id: new ObjectID('5c6c438064edf24090b969ee')
    }).toArray().then((docs) => {
        console.log('Find todos by id');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    //Count
    db.collection('Todos').count().then((counts) => {
        console.log('Total count:', counts);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });


    //Query users and find by name
    var name = 'Paula';
    db.collection('Users').find({
        name: name
    }).toArray().then((docs) => {
        console.log(`Find by name ${name}`);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users', err);
    });



    client.close();
});