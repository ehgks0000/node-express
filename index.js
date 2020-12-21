require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./lib/passport');
passportConfig();
const connectDB = require('./db');
// const connectDB = require('./db')(session);
const usersRoute = require('./rotues/Users');
const memosRoute = require('./rotues/Memos');
const errorHandler = require('./middleware/error');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');

const morgan = require('morgan');
const { stream } = require('./lib/winstons');

connectDB();
// const dev = process.env.NODE_ENV !== "production" ;
// const prod = process.env.NODE_ENV === "production" ;
const app = express();
app.use(morgan('combined', { stream }));

//  express-session
app.use(
  session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    // store: new connectDB(),
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
app.get('/', (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  //   const agent = req.headers['User-Agent'];
  const agent = req.get('User-Agent') || null;
  if (agent !== 'ELB-HealthChecker/2.0') {
    console.log('서버홈이 작동 되었습니다', ip, agent);
  }
  res.send({ message: '서버 홈이 작동되었습니다!' });
});
app.use('/users', usersRoute);
app.use('/memos', memosRoute);
// app.use('/auth', authRoute);
// app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 1337;
app.listen(port, () => {
  console.log('server is open', port);
  //   console.log(process.env.NODE_ENV);
});

module.exports = app;

// CRUD create read update delete

//todos
//isActivated ,

//error : 유저 동시접속(여러 기기 접속) 어떻게 관리?
// user 모델에 배열로 mac과 토큰 입력으로

// cross-env NODE_ENV=production PORT=80 pm2 start index.js
// npm rebuild bcrypt --build-from-source
// npm i -g node-pre-gyp

//Warning: connect.session() MemoryStore is not
// 0|index    | designed for a production environment, as it will leak
// 0|index    | memory, and will not scale past a single process.

//알게된것
//1024 보다 작은 숫자의 포트는 루트에서만 권한 생김
