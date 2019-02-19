//http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
//https://docs.mongodb.com/manual/reference/operator/update/

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


    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5c6c59b4393ff23f247e26b4')
    }, {
            $set: {
                completed: false
            }
        }, {
            returnOriginal: false
        }
    ).then((res) => {
        console.log('UPDATE TODO')
        console.log(res);
    }, (err) => {
        console.log('Unable to update the record', err);
    });

    //update users
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c6c5d49b8aa321fa475a40c')
    }, {
            $set: {
                name: 'Miguel'
            },
            $inc: {
                age: 10
            },
            $unset: {
                fieldtodelete:''
            }
        }, {
            returnOriginal: false
        }).then((res) => {
            console.log('UPDATE USER')
            console.log(res);
        }, (err) => {
            console.log('Unable to update the record', err);
        });

    client.close();
});