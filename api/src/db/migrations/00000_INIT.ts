import keys from "../../config/keys"

const OSSPEXT = `CREATE EXTENSION IF NOT EXISTS uuid-ossp;`
// const envDatabase = (db: string) => `CREATE DATABASE IF NOT EXISTS ${db};`
// const changeToEnvDatabase = (db: string) => `${"/"}connect ${db}`
console.log("Extentions Migrated to DB")
module.exports.generateSql = () =>
  `${OSSPEXT}`