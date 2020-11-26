const User = require('../models/Users');
//isLogin ?
const auth = (req, res, next) => {
    let token = req.cookies.x_auth;
    console.log('auth.js');
    //토큰이 있으면 로그인 되어있는 상태
    User.findByToken(token, process.env.JWT_SECRET_KEY3)
        .then(user => {
            if (!user) {
                // res.json({
                //     message: '로그인 안되어있습니다!',
                // });
                console.log('auth : 로그인 안되어있습니다!');
                return next();
            }
            req.token = token;
            req.user = user;
            console.log('auth 접근 : ', req.user);
            next();
        })
        .catch(err => {
            throw err;
        });
};

module.exports = { auth };
