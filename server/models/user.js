//https://mongoosejs.com/docs/validation.html#custom-validators
//https://www.npmjs.com/package/validator
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        minlength: 1,
        trim: true,
        unique: [true, 'email already exists'],
        validate: {
            //validator: (value => {
            //    return validator.isEmail(value);
            //}),
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject(); //takes your regular mongoose object to a regular javascript object

    return _.pick(userObject, ['_id', 'email']);
};



UserSchema.methods.generateAuthToken = function () {
    //instance methods get called with individual document
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

    //user.tokens.concat([{ access, token }]);
    user.tokens.push({access, token});


    //we return to make the promise in server.js
    return user.save().then(() => {
        return token;
    });
};


//function is used because we need access to the this binding
UserSchema.statics.findByToken = function (token) {
    //model methods get called with the model as this binding
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        //retrn a promise so in server.js you can call then to catch the error.
        //return new Promise((resolve, reject)=>{
        //    reject();
       // });

       //this is shorthand for promise
       return Promise.reject();
    }

    //quotes are used when the dot is used to access to a property of the object
    return User.findOne({
        '_id':decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
    
};


var User = mongoose.model('User', UserSchema);


module.exports = { User };
