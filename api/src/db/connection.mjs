import knex from "knex";
import Config from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";

const ENV_Config = Config[environment];

export default knex(ENV_Config);
