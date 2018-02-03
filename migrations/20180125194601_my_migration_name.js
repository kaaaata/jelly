exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('commands', (command) => {
    command.increments('uid').notNullable().primary();
    command.string('profile').notNullable();
    command.integer('id').notNullable();
    command.string('alias').notNullable();
    command.string('url').notNullable();
  }),
  knex.schema.createTableIfNotExists('profiles', (profile) => {
    profile.increments('uid').notNullable().primary();
    profile.string('username').notNullable();
    profile.string('password').notNullable();
  }),
]);
  
exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTableIfExists('commands'),
  knex.schema.dropTableIfExists('profiles'),
]);

