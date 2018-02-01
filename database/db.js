let config = require('../knexfile');

let env = 'development';
let knex = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]);
