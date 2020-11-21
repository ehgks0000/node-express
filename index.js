const express = require('express');
const cors = require('cors');

const db = require('./db');

const usersRoute = require('./rotues/Users');
const { auth } = require('./middleware/auth');
const User = require('./models/Users');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
require('dotenv/config');
// const dotenv = require('dotenv');
// dotenv.config();

db();

const app = express();

app.use(
    cors(),
    // cors({
    //     origin: true,
    //     credentials: true,
    // }),
);
// cors 설정하니깐 화면 왜 안나오냐 ? >>> cors() 괄호 써야함

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/users', usersRoute);
// app.use('/auth', auth);

//auth 위에 선언할때 {} 괄호 있고 없고 차이는 무엇인가?
app.get('/auth', auth, (req, res) => {
    //auth 미들웨어를 통과한 상태 이므로
    //req.user에 user값을 넣어줬으므로
    // console.log('/auth 접근');
    return res.status(200).json({
        _id: req.user._id,
        // isAdmin: req.user.role === 09 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        // image: req.user.image,
    });
});

// 여기서는 잘되네,,
app.get('/logout', auth, (req, res) => {
    // useFindAndModify
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: ' ' },
        // { $set: { token: '' } },
        (err, user) => {
            if (err) return res.json({ logoutSuccess: false, err });
            // res.clearCookie('x_auth');
            return res.clearCookie('x_auth').status(200).send({
                logoutSuccess: true,
                message: '로그아웃 되었습니다!',
            });
        },
    );
    console.log('로그아웃 되었습니다!');
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log('server is open', port);
});

module.exports = app;

// CRUD create read update delete
