const keys = require("./src/config/keys");

function BaseConfig(environemntDB) {
  return {
    client: "pg",
    migrations: {
      directory: `./src/db/migrations`,
    },
    seeds: {
      directory: `./src/db/seeds`,
    },
    connection: {
      host: keys.PGHOST,
      user: keys.PGUSER,
      password: keys.PGPASS,
      database: environemntDB,
      port: keys.PGPORT,
    },
  };
}
const knex = (env) => {
  if (env === "production") {
    return BaseConfig(keys.PROD_DB);
  }
  if (env === "test") {
    return BaseConfig(keys.TEST_DB);
  } else {
    return BaseConfig(keys.DEV_DB);
  }
};

module.exports = knex;
