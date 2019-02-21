//https://mongoosejs.com/docs/validation.html
//https://mongoosejs.com/docs/guide.html

const mongoose = require('mongoose');
const {port}  = require('./../server');

//let mongoose use promises
mongoose.Promise = global.Promise;

//const externalUrl = 'mongodb://miguel:miguelb1!@mongodbtestapps-shard-00-00-ykl1d.mongodb.net:27017,mongodbtestapps-shard-00-01-ykl1d.mongodb.net:27017,mongodbtestapps-shard-00-02-ykl1d.mongodb.net:27017/test?ssl=true&replicaSet=mongodbTestApps-shard-0&authSource=admin&retryWrites=true';
 
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = { mongoose };

