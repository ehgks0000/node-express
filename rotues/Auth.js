const express = require('express');
// const jwt = require('jsonwebtoken');
const passport = require('passport');

const { login, logout } = require('../controllers/Users');

const { auth } = require('../middleware/auth');
const router = express.Router();

router.route('/login').post(auth, login);
router.route('/logout').get(auth, logout);

router
    .route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));
// .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
    passport.authenticate('google', {
        // successRedirect: '/auth/google/success',
        failureRedirect: '/login',
    }),
    async (req, res) => {
        // const jwt = createJWTFromUserData(req.user);
        const user = req.user;
        try {
            const expiresTime = '1h'; // 1시간 후 토큰 만료로 자동 로그아웃?
            const userToken = await user.generateToken(
                process.env.JWT_SECRET_KEY3,
                expiresTime,
            );
            if (user.isAdmin) {
                console.log('Admin 로그인 되었습니다!');
            } else {
                console.log('일반회원 로그인 되었습니다!');
            }
            // console.log(userToken);
            return res
                .cookie('x_auth', userToken)
                .clearCookie('reset_auth')
                .redirect('/users/auth');
            // return res
            //     .cookie('x_auth', userToken)
            //     .clearCookie('reset_auth')
            //     .status(200)
            //     .json({
            //         loginSuccess: true,
            //         userId: user._id,
            //         isAdmin: user.isAdmin,
            //         isCertified: user.isCertified,
            //         token: userToken,
            //         // resetPasswordToken: user.resetPasswordToken,
            //     });
        } catch (err) {
            res.json({ loginSuccess: false, err: '토큰 오류' });
        }

        // res.redirect('/users');
    },
);

module.exports = router;
