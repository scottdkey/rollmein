require("dotenv").config();
const BASE_PATH = `${__dirname}/src/db`;

const { PGPORT, PGHOST, PGPASS, PGUSER } = process.env;

function BaseConfig(environemntDB) {
  return {
    client: "pg",
    migrations: {
      directory: `${BASE_PATH}/migrations`,
    },
    seeds: {
      directory: `${BASE_PATH}/seeds`,
    },
    connection: `postgres://${PGUSER}:${PGPASS}@${PGHOST}:${PGPORT}/${environemntDB}`,
  };
}

module.exports = {
  test: BaseConfig("rollmein_test"),
  development: BaseConfig("rollmein_dev"),
};
