import knex from "knex";
// @ts-ignore
import Config from "../../knexfile.js";
import keys from "../config"
import { KnexConfigObject } from "../config/interfaces"


const knexConfig: KnexConfigObject = Config(keys.NODE_ENV || "development");

export default knex(knexConfig);
