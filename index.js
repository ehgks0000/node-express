const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { stream } = require('./config/winstons');

const passport = require('./config/passport');

const db = require('./db');

const usersRoute = require('./rotues/Users');
const authRoute = require('./rotues/Auth');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv/config');
// const dotenv = require('dotenv');
// dotenv.config();
db();
const app = express();
app.use(morgan('combined', { stream }));

// google oauth2 설정 중 passport express-session passport-google-oauth20
app.use(
    session({ secret: 'Mysecret', resave: false, saveUninitialized: true }),
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
app.use('/auth', authRoute);
// app.use('/auth', authRoute);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log('server is open', port);
});

module.exports = app;

// CRUD create read update delete

//todos
//isActivated , user image upload ,
