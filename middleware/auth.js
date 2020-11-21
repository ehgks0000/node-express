const User = require('../models/Users');

const auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    User.findByToken(token)
        .then(user => {
            if (!user) return res.json({ isAuth: false, error: true });
            req.token = token;
            req.user = user;
            console.log(`auth 접근 : ${req.user}`);
            next();
        })
        .catch(err => {
            throw err;
        });
};

module.exports = { auth };
