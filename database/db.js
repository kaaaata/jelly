let config = require('../knexfile');

let env = process.env.PORT ? 'production' : 'development';

let knex = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]);
