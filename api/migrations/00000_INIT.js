import keys from "../src/config/keys"

const OSSPEXT = `CREATE EXTENSION IF NOT EXISTS uuid-ossp;`
const envDatabase = (db) => `CREATE DATABASE IF NOT EXISTS ${db};`
const changeToEnvDatabase = (db) => `${"/"}connect ${db}`

module.exports.generateSql = () =>
  `${OSSPEXT} ${envDatabase(keys.PGDATABASE)} ${changeToEnvDatabase}`