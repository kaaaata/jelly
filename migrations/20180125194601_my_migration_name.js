exports.up = (knex, Promise) => Promise.all([
    knex.schema.createTableIfNotExists('commands', (command) => {
      command.increments('uid').notNullable().primary();
      command.string('profile').notNullable();
      command.integer('id').notNullable();
      command.string('alias').notNullable();
      command.string('url').notNullable();
    }),
  ]);
  
  exports.down = (knex, Promise) => Promise.all([
    // knex.schema.table('outer rim', (shit) => {
    //   shit.dropForeign('user_id');
    // }),
    knex.schema.dropTableIfExists('commands'),
  ]);
  
  