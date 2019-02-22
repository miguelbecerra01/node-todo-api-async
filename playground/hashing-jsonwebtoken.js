//https://jwt.io/
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc');
console.log('Encoded: ', token);


var decoded = jwt.verify(token, '123abc');
console.log('Decoded: ', decoded);