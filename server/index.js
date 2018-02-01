const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const psqlHelper = require('../database/postgres');
const db = require('../database/db');
const dbHelpers = require('../database/index');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.path}, ${req.method}, ${req.status}, ${JSON.stringify(req.body)}`);
  next();
});
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, '../client/dist')));
app.listen(process.env.PORT || 3000);
