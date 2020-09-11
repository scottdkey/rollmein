"use strict";
require("dotenv").config();
var _a = process.env, PGPORT = _a.PGPORT, PGHOST = _a.PGHOST, PGPASS = _a.PGPASS, PGUSER = _a.PGUSER, DEV_DB = _a.DEV_DB, TEST_DB = _a.TEST_DB, PROD_DB = _a.PROD_DB;
function BaseConfig(environemntDB) {
    return {
        client: "pg",
        migrations: {
            directory: "./src/db/migrations",
        },
        seeds: {
            directory: "./src/db/seeds",
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
var knex = function (env) {
    if (env === "production") {
        return BaseConfig(PROD_DB);
    }
    if (env === "test") {
        return BaseConfig(TEST_DB);
    }
    else {
        return BaseConfig(DEV_DB);
    }
};
module.exports = knex;
