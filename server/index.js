const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon')

const psqlHelper = require('../database/postgres');
const db = require('../database/db');
const dbHelpers = require('../database/index');

const app = express();
app.use(favicon(__dirname + '/../client/dist/favicon.ico'));
// note: google chrome can't display local favicons
app.use(express.static( __dirname + '/../client/dist'));
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

app.listen(process.env.PORT || 3000);

// COMMANDS ROUTES
app.post('/post', async(req, res, next) => {
  // update user profile commands
  const output = await dbHelpers.updateCommands(req.body.profile, req.body.commands);
  res.status(201).json({
    message: `Successful POST -> /post`
  });
});
app.get('/get/:profile', async(req, res, next) => {
  // get all commands for a chosen profile
  const output = await dbHelpers.getCommands(req.params.profile);
  res.status(200).json({
    message: `Successful GET -> /get`,
    output: output
  });
});

// LOGIN ROUTES
app.get('/userprofileexists/:profile', async(req, res, next) => {
  // does a user profile exist already?
  const output = await dbHelpers.userProfileExists(req.params.profile);
  res.status(200).json({
    message: `Successful GET -> /userprofileexists`,
    output: output
  });
});
app.get('/authenticate/:profile/:password', async(req, res, next) => {
  // profile/password combo valid?
  const output = await dbHelpers.authenticate(req.params.profile, req.params.password);
  res.status(200).json({
    message: `Successful GET -> /authenticate`,
    output: output
  });
});
app.post('/newprofile', async(req, res, next) => {
  // new profile creation
  const output = await dbHelpers.newProfile(req.body.username, req.body.password);
  res.status(201).json({
    message: `Successful POST -> /newprofie`
  });
});

// ~JELLY ROUTES
app.get('/getallfrom/:table', async(req, res, next) => {
  // see everything in 'commands' table
  const output = await dbHelpers.getAllFrom(req.params.table);
  res.status(200).json({
    message: `Successful GET -> /getallfrom`,
    output: output
  });
});
