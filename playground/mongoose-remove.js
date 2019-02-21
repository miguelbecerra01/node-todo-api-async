const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


Todo.findByIdAndDelete('5c6ee45c30480ea049a6d58d').then((todo)=>{
    console.log(todo); 
},(err)=>{
    console.log('Unable to remove todo', err); 
});

Todo.findOneAndDelete({_id:'5c6ee44f30480ea049a6d581'}).then((todo)=>{
    console.log(todo); 
},(err)=>{
    console.log('Unable to remove todo', err); 
});


