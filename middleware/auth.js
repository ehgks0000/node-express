const User = require('../models/Users');
//isLogin ?
const auth = (req, res, next) => {
    const token = req.cookies.x_auth;
    if (!token) {
        // console.log('auth : 로그인 안되어 있습니다!');
        return res.status(500).send('auth : 로그인 안되어 있습니다!');
        // throw new Error('please authenticate');
        // return next();
    }
    try {
        User.findByToken(token, process.env.JWT_SECRET_KEY3).then(user => {
            if (!user) {
                // console.log('auth : 로그인 안되어 있습니다!');
                throw new Error();
                // res.status(500).send('auth : 로그인 안되어 있습니다!');
                // return next();
            }
            req.token = token;
            req.user = user;
            next();
        });
    } catch (e) {
        throw new Error('please authenticate');
        // res.status(401).send({ error: 'please authenticate.' });
    }
};

module.exports = { auth };
