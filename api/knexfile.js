const BASE_PATH = `${__dirname}/src/server/db`;
require("dotenv").config();

const { PGPORT, PGHOST, PGPASS, PGUSER } = process.env;

function BaseConfig(envDB) {
  return {
    client: "pg",
    migrations: {
      directory: `${BASE_PATH}/migrations`,
    },
    seeds: {
      directory: `${BASE_PATH}/seeds`,
    },
    connection: `postgres://${PGUSER}:${PGPASS}@${PGHOST}:${PGPORT}/${envDB}`,
  };
}

module.exports = {
  test: BaseConfig("rollmein_test"),
  development: BaseConfig("rollmein_dev"),
  production: BaseConfig("rollmein_api")
};
