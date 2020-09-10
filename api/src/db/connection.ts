import knex from "knex";
import Config from "../../knexfile.js";

const currentEnv: string = process.env.NODE_ENV! || "development";
interface ConfigObject {
  client: string;
  migrations: object;
  seeds: object;
  connection: object;
}

const knexConfig: ConfigObject = Config(currentEnv);

export default knex(knexConfig);
