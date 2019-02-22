//https://mongoosejs.com/docs/validation.html#custom-validators
//https://www.npmjs.com/package/validator
//https://mongoosejs.com/docs/middleware.html

/*

How can we decide to use whether Instance method or Model method ?

You use static methods if you want to do something with a collection 
(i.e. search the Users collection) and an instance method if you want to do
 something on an individual document (i.e. a specific User).

*/
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


//use validator for the schema
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

//overrites the output to only show _id and email, the rest is not shown
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject(); //takes your regular mongoose object to a regular javascript object

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    //instance methods get called with individual document
    var user = this;
    var access = 'auth';
    var token = jwt.sign(
        {
            _id: user._id.toHexString(),
            access
        },
        process.env.JWT_SECRET, 
        {
            expiresIn: '1m' //expires in 1 minute
        }).toString();

    //user.tokens.concat([{ access, token }]);
    user.tokens.push({ access, token });

    //we return to make the promise in server.js
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    //with return we return to the promise
    return user.updateOne({
        //$pull removes any object that has a token equal to the token sent 
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};




//function is used because we need access to the this binding
/*The simplest way is to keep in mind that the .statics methods
 operate on an entire collection while the .methods methods
  act on a single document so you'd use const User = this in the first case 
  and const user = this in the second case. */

UserSchema.statics.findByToken = function (token) {
    //model methods get called with the model as this binding
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    //Chaining to the promise
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    reject(err);
                }

                if (res) {
                    resolve(user);
                } else {
                    reject(res);
                }
            });
        });
    });
};

//run this before save is fired
UserSchema.pre('save', function (next) {

    var user = this;

    //look if the property is modified
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});


var User = mongoose.model('User', UserSchema);


module.exports = { User };
