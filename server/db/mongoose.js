//https://mongoosejs.com/docs/validation.html
//https://mongoosejs.com/docs/guide.html

const mongoose = require('mongoose');

//let mongoose use promises
mongoose.Promise = global.Promise;

const externalUrl = 'mongodb://miguel:miguelb1!@mongodbtestapps-shard-00-00-ykl1d.mongodb.net:27017,mongodbtestapps-shard-00-01-ykl1d.mongodb.net:27017,mongodbtestapps-shard-00-02-ykl1d.mongodb.net:27017/test?ssl=true&replicaSet=mongodbTestApps-shard-0&authSource=admin&retryWrites=true';
const localUrl = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(externalUrl, { useNewUrlParser: true });



module.exports = { mongoose };

