require("dotenv").config();

const {
  PGPORT,
  PGHOST,
  PGPASS,
  PGUSER,
  DEV_DB,
  TEST_DB,
  PROD_DB,
} = process.env;

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
      host: PGHOST,
      user: PGUSER,
      password: PGPASS,
      database: environemntDB,
      port: PGPORT,
    },
  };
}
const knex = (env) => {
  if (env === "production") {
    return BaseConfig(PROD_DB);
  }
  if (env === "test") {
    return BaseConfig(TEST_DB);
  } else {
    return BaseConfig(DEV_DB);
  }
};

module.exports = knex;
