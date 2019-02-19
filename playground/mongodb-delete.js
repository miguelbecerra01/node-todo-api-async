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

    //deleteMany
    db.collection('Todos').deleteMany({ text: 'Something to do' }).then((res) => {
        console.log('deleteMany');
        console.log(res);
    }, (err) => {
        console.log('Unable to delete record', err);
    });

    //deleteOne
    db.collection('Todos').deleteOne({ text: 'Walk 30 min' }).then((res) => {
        console.log('deleteOne');
        console.log(res);
    }, (err) => {
        console.log('Unable to delete record', err);
    });

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID('5c6c59b1ce646242488ae83b')
    }).then((res) => {
        console.log('findOneAndDelete');
        console.log(res);
    }, (err) => {
        console.log('Unable to delete record', err);
    });

    //users
    db.collection('Users').deleteMany({ name: 'Paula' }).then((res) => {
        console.log('***Delete users with the name Paula***');
        console.log('Users Deleted: ', res.deletedCount);
    }, (err) => {
        console.log('Unable to delete record', err);
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5c6c48b6fa983c4ac4e041b3')
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log('Unable to delete record', err);
    });

    client.close();
});