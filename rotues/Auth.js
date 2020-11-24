const express = require('express');
const passport = require('passport');

const { login, logout } = require('../controllers/Users');

const { auth } = require('../middleware/auth');
// const { successRedirect } = require('../middleware/successRedirect');

const router = express.Router();

router.route('/').get(auth, (req, res) => {
    const {
        age,
        isAdmin,
        isCertified,
        isActivated,
        _id,
        email,
        name,
        googleId,
        date,
    } = req.user;
    return res.json({
        _id,
        googleId,
        email,
        name,
        age,
        isAdmin,
        isActivated,
        isCertified,
        date,
    });
});

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
    // successRedirect(),
    async (req, res) => {
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
                .redirect('/auth');
        } catch (err) {
            res.json({ loginSuccess: false, err: '토큰 오류' });
        }
    },
);

// async function successRedirect(req, res) {
//     const user = req.user;
//     try {
//         const expiresTime = '1h'; // 1시간 후 토큰 만료로 자동 로그아웃?
//         const userToken = await user.generateToken(
//             process.env.JWT_SECRET_KEY3,
//             expiresTime,
//         );
//         if (user.isAdmin) {
//             console.log('Admin 로그인 되었습니다!');
//         } else {
//             console.log('일반회원 로그인 되었습니다!');
//         }
//         // console.log(userToken);
//         return res
//             .cookie('x_auth', userToken)
//             .clearCookie('reset_auth')
//             .redirect('/auth');
//     } catch (err) {
//         res.json({ loginSuccess: false, err: '토큰 오류' });
//     }
// }

module.exports = router;
