import { Pool, Client } from "pg"
import { createDb, migrate } from "postgres-migrations"
import controllers from "./controllers"
import models from "./models"
import dotenv from "dotenv"
import { Console } from "console"

dotenv.config()


const pool: Pool = new Pool()

const envdb = (env: string) => {
  let working_database = "placeholder"
  if (env === "production") {
    working_database = process.env.PRODUCTION_DATABASE!
  } else if (env === "test") {
    working_database = process.env.TEST_DATABASE!
  } else {
    working_database = process.env.DEVELOPMENT_DATABASE!
  }
  process.env.PGDATABASE = working_database
  return working_database
}
const db = envdb(process.env.NODE_ENV!)
const createDatabase = async () => {
  const client = await new Client({
    database: process.env.PGUSER,
  })
  await client.connect().then(() =>
    createDb(db, { client })
  ).catch((e) => {
    setTimeout(() => {
      console.log(e.stack)
      console.log("Retrying Connection in 3 seconds")
      migration()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}
const migration = async () => {
  const client = new Client({})
  await client.connect().then(async () => {
    await migrate({ client }, "build/db/migrations")
  }).catch((e) => {
    setTimeout(() => {
      console.log(e.stack)
      console.log("Retrying Connection in 3 seconds")
      migration()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}
const query = async (text: string, params: any[]) => {
  const start = Date.now()
  const db = await pool.connect()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, params, duration, rows: res.rowCount })
  await db.release()
  return res
}


export default {
  query,
  envdb,
  migration,
  createDatabase,
  controllers,
  models
}