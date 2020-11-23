const express = require('express');
const cors = require('cors');
const { stream } = require('./config/winstons');

const db = require('./db');

const usersRoute = require('./rotues/Users');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const morgan = require('morgan');
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

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use('/users', usersRoute);
app.use(morgan('combined', { stream }));
// app.use('/auth', auth);
const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log('server is open', port);
});

module.exports = app;

// CRUD create read update delete

//todos
//isActivated , user image upload ,
