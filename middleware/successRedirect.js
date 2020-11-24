const successRedirect = async (req, res, next) => {
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
        res.cookie('x_auth', userToken)
            .clearCookie('reset_auth')
            .redirect('/auth');
        next();
    } catch (err) {
        res.json({ loginSuccess: false, err: '토큰 오류' });
        next();
    }
};

module.exports = { successRedirect };
