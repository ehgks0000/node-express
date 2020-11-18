const express = require('express');
const cors = require('cors');

const db = require("./db");
const dotenv = require('dotenv');
dotenv.config();

db();

const app = express();

app.use(cors);

app.get('/api', (req, res) => {
  res.status(404).json({message: "asdfadsfasdf"})
});

const port = process.env.PORT || 1337

app.listen(port, () => {
  console.log('server is open', port);
});

module.exports = app;
