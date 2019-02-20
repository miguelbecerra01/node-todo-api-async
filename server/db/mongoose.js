//https://mongoosejs.com/docs/validation.html
//https://mongoosejs.com/docs/guide.html

const mongoose = require('mongoose');

//let mongoose use promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = { mongoose };

