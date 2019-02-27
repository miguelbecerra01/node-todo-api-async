var { User } = require('./../models/user');

//middleware to validate token before users/me gets fired
var authenticate = async (req, res, next) => {
    try {
        const token = req.header('x-auth');
        const user = await User.findByToken(token);
        if (!user) {
            //go directly to the catch statement
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        //next is required so /users/me can be called.
        next();
    } catch (err) {
        res.status(401).send();
    }
};


module.exports = { authenticate }