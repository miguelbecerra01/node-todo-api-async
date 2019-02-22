//https://mongoosejs.com/docs/validation.html#custom-validators
//https://www.npmjs.com/package/validator
const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
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

module.exports = { User };
