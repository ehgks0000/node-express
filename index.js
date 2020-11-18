const express = require('express');
const cors = require('cors');

const db = require("./db");
const usersRoute = require("./rotues/Users");
const bodyparser = require("body-parser");
require('dotenv/config');
// const dotenv = require('dotenv');
// dotenv.config();

db();

const app = express();

// app.use(cors);
// cors 설정하니깐 화면 왜 안나오냐 ?
app.use(bodyparser.json());
app.use("/users", usersRoute);


const port = process.env.PORT || 1337

app.listen(port, () => {
  console.log('server is open', port);
});

module.exports = app;
