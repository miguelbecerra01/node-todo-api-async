var { User } = require('./../models/user');

//middleware to validate token before users/me gets fired
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            //go directly to the catch statement
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        //next is required so /users/me can be called.
        next();

    }).catch((e) => {
        res.status(401).send();
    });
};


module.exports = { authenticate }