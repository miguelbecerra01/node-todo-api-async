//https://mongoosejs.com/docs/validation.html
//https://mongoosejs.com/docs/guide.html

const mongoose = require('mongoose');

//let mongoose use promises
mongoose.Promise = global.Promise;

const externalUrl = 'mongodb+srv://miguel:miguelb1!@mongodbtestapps-ykl1d.mongodb.net/test?retryWrites=true';
const localUrl = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(externalUrl, { useNewUrlParser: true });



module.exports = { mongoose };

