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

module.exports = {
  test: BaseConfig(TEST_DB),
  development: BaseConfig(DEV_DB),
  production: BaseConfig(PROD_DB),
};
