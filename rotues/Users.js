const express = require('express');
const { upload } = require('../lib/multer');
const {
  register,
  getUsers,
  getUserById,
  deleteUser,
  patchUser,
  selfResetPassword,
  login,
  logout,
  logoutAll,
  sendingResetEmail,
  resetPasswordbyEmail,
  certifyUser,
  test,
  me,
  uploadImg,
  deleteImg,
  getImg,
  finding,
} = require('../controllers/Users');
const passport = require('passport');
const errorHandler = require('../middleware/error');
const { auth } = require('../middleware/auth');
const router = express.Router();
const User = require('../models/Users');

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
router.route('/me').get(auth, me);

//이메일로 발송된 링크로 회원 인증
router.route('/certify/:token').get(auth, certifyUser);

router.route('/auth').get(auth, (req, res) => {
  //auth 미들웨어를 통과한 상태 이므로
  //req.user에 user값을 넣어줬으므로

  if (!req.user) {
    return res.json({ message: '로그인 안되어 있습니다!' });
  }
  const user = req.user;

  return res.json({
    _id: req.user._id,
    googleId: req.user.googleId,
    naverId: req.user.naverId,
    email: req.user.email,
    name: req.user.name,
    age: req.user.age,
    isAdmin: req.user.isAdmin,
    isActivated: req.user.isActivated,
    isCertified: req.user.isCertified,
    date: req.user.date,
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

router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));
// .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/auth/google/callback').get(
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
        .redirect('/users/auth');
    } catch (err) {
      res.json({ loginSuccess: false, err: '토큰 오류' });
    }
  },
);

router
  .route('/auth/naver')
  .get(passport.authenticate('naver', null), (req, res) => {
    console.log('/users/auth/naver');
  });
router.route('/auth/naver/callback').get(
  passport.authenticate('naver', {
    failureRedirect: '/login',
  }),
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
        .redirect('/users/auth');
    } catch (err) {
      res.json({ loginSuccess: false, err: '토큰 오류' });
    }
  },
);

router.route('/logout').get(auth, logout);
router.route('/logoutAll').get(auth, logoutAll);

//로그인 상태의 회원이 패스워드 수정
router.route('/modify').post(auth, selfResetPassword);

// 패스워드 찾기 - 비밀번호 까먹었을 떄 이메일로 토큰 발급
// 비밀번호 수정
router.route('/reset').post(sendingResetEmail);
router.route('/reset/:token').post(resetPasswordbyEmail);
router.route('/finding').post(finding);

router
  .route('/uploadImg')
  .post(auth, upload.single('img'), uploadImg, errorHandler)
  .delete(auth, deleteImg);
router.route('/:id/avatar').get(getImg);

router.route('/test').get(auth, test);

//미들웨어 사용, 보내기전 보낸후 사용 가능

//회원 인증 메일 보내기
// router.route('/certify/:certifyToken').get(sendingCertifiedMail);

module.exports = router;
