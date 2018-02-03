const knex = require('./db');

const updateCommands = async(profile, data) => {
  await knex('commands').where('profile', profile).delete();
  await knex('commands').insert(data.map(command => {
    return {
      profile: profile,
      id: command.id,
      alias: Object.keys(command)[1],
      url: Object.values(command)[1],
    }
  }));
};
const getCommands = async(profile) => {
  const ret = [];
  (await knex.select().where('profile', profile).from('commands')).forEach(command => {
    const obj = {};
    obj.id = command.id;
    obj[command.alias] = command.url;
    ret.push(obj);
  });
  return ret;
};
const getAllCommands = async() => {
  return await knex.select().from('commands');
};
module.exports = {
    updateCommands,
    getCommands,
    getAllCommands,
};
