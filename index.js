const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./lib/passport');
const connectDB = require('./db');
const usersRoute = require('./rotues/Users');
const errorHandler = require('./middleware/error');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');

const morgan = require('morgan');
const { stream } = require('./lib/winstons');

require('dotenv').config({ path: './config/config.env' });

connectDB();
const app = express();
app.use(morgan('combined', { stream }));

//  express-session
app.use(
    session({
        secret: process.env.EXPRESS_SESSION,
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors(),
    // cors({
    //     origin: true,
    //     credentials: true,
    // }),
);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/users', usersRoute);
// app.use('/auth', authRoute);
// app.use(errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log('server is open', port);
});

module.exports = app;

// CRUD create read update delete

//todos
//isActivated ,

//error : 유저 동시접속(여러 기기 접속) 어떻게 관리?
// user 모델에 배열로 mac과 토큰 입력으로
