const express = require('express');
const {
    register,
    getUsers,
    getUserById,
    deleteUser,
    patchUser,
    issuingResetPasswordToken,
    login,
    logout,
    sendingResetEmail,
    resetPassword,
    certifyUser,
    test,
} = require('../controllers/Users');

const { auth } = require('../middleware/auth');
const router = express.Router();

router
    // users/
    .route('/')
    //유저 검색
    .get(getUsers)
    // auth 미들웨어로 req에 user 갖고있다면(로그인 돼있다면) 삭제가능
    .delete(auth, deleteUser)
    //회원 스스로 데이터 수정
    .patch(auth, patchUser)

    //회원가입 및 이메일인증 발송
    .post(auth, register);

//이메일로 발송된 링크로 회원 인증
router.route('/certify/:token').get(auth, certifyUser);

router.route('/auth').get(auth, (req, res) => {
    //auth 미들웨어를 통과한 상태 이므로
    //req.user에 user값을 넣어줬으므로

    return res.status(200).json({
        _id: req.user._id,
        // isAdmin: req.user.role === 09 ? false : true,
        isAuth: true,
        isAdmin: req.user.isAdmin,
        isCertified: req.user.isCertified,
        email: req.user.email,
        name: req.user.name,
    });
});

router
    .route('/search/:userId')
    //id값으로 특정 유저 검색
    .get(auth, getUserById)
    //id값으로 특정 유저 삭제 //관리자만
    .delete(auth, deleteUser)
    //id값으로 특정 유저 수정 // 관리자만
    .patch(auth, patchUser);

router.route('/login').post(auth, login);
router.route('/logout').get(auth, logout);
// router.get('/logout', auth, logout);

//비밀번호 까먹었을 떄 이메일로 토큰 발급
router.route('/reset').post(sendingResetEmail);
//로그인 상태의 회원 리셋 토큰 발급
router.route('/modify').get(auth, issuingResetPasswordToken);
// 비밀번호 수정
router.route('/reset/:token').post(resetPassword);

//회원 인증 메일 보내기
// router.route('/certify/:certifyToken').get(sendingCertifiedMail);

// router.route('/test').get(test);

module.exports = router;
