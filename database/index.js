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

const userProfileExists = async(profile, data) => {
  return (await knex.select().where('username', profile).from('profiles')).length;
};
const authenticate = async(profile, password) => {
  console.log(`trying profile: ${profile}, password: ${password}`);
  console.log((await knex.select('password').where('username', profile).from('profiles'))[0].password);
  return (await knex.select('password').where('username', profile).from('profiles'))[0].password === password;
}
const newProfile = async(username, password) => {
  await knex('profiles').insert({ username: username, password: password });
}

const getAllFrom = async(table) => {
  return await knex.select().from(table);
};

module.exports = {
    updateCommands,
    getCommands,
    userProfileExists,
    authenticate,
    newProfile,
    getAllFrom,
};

