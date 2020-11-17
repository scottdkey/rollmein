import fs from 'fs'
import keys from "./keys"
import { envdb } from "../db"

const getDBEnvVariables = (env: string) => {
  const db = envdb
  return {
    username: keys.PGUSER,
    password: keys.PGPASS,
    database: db,
    host: keys.PGHOST,
    dialect: "postgres"
  }
}


const development = getDBEnvVariables('development')
const test = getDBEnvVariables('test')
const production = getDBEnvVariables('production')

export {
  development,
  test,
  production
}