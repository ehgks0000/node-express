const express = require('express');

const User = require('../models/Users');
const {
    register,
    getUsers,
    getUserById,
    deleteUser,
    patchUser,
    login,
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
    //회원가입
    .post(register);

router
    .route('/:userId')
    //id값으로 특정 유저 검색
    .get(getUserById)
    //id값으로 특정 유저 삭제 //관리자만
    .delete(deleteUser)
    //id값으로 특정 유저 수정 // 관리자만
    .patch(patchUser);

router.route('/login').post(login);

module.exports = router;
