let config = require('../knexfile');

let env = 'production';
//let env = 'development';

let knex = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]);
