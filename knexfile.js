module.exports = {
  production: {
    client: 'pg',
    debug: true,
    connection: 'postgres://phjfuejzyggaes:de621a725cd65db8fce49a3b402f8f9dd912f7181fadfcac10225db25449ef07@ec2-54-227-244-122.compute-1.amazonaws.com:5432/ddr1snvk080s4g',
    ssl: true,
    migrations: {
      commands: 'migrations'
    },
  },
  development: {
    client: 'postgresql',
    connection: {
      database: 'jelly',
    },
  },
};
