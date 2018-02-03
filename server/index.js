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

// ROUTES THAT ARE ACTUALLY USED
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
})

// JELLY ROUTES
app.get('/see', async(req, res, next) => {
  // see everything in 'commands' table
  const output = await dbHelpers.see();
  res.status(200).json({
    message: `Successful GET -> /see`,
    output: output
  });
})