import { Pool, Client, QueryResult } from "pg"
import { createDb, migrate } from "postgres-migrations"
import controllers from "./controllers"
import models from "./models"
import dotenv from "dotenv"

dotenv.config()


const pool: Pool = new Pool()

const db = process.env?.PGDATABASE || "rollmein_dev"
console.log(process.env?.pgHost)
console.log(db)
const createDatabase = async () => {
  const client = await new Client({
    database: process.env.PGUSER,
  })
  await client.connect().then(() =>
    createDb(db, { client })

  ).catch((e) => {
    console.log(e.stack)
    setTimeout(() => {
      console.error('Retrying Connection in 3 seconds')
      createDatabase()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}
const migration = async (): Promise<void> => {
  const client = new Client({})
  await client.connect().then(async () => {
    await migrate({ client }, "build/db/migrations")
  }).catch((e) => {
    console.log(e.stack)
    setTimeout(() => {
      console.log("Retrying Connection in 3 seconds")
      migration()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}
const query = async (text: string, params: any[]): Promise<QueryResult<any>> => {
  const start = Date.now()
  const db = await pool.connect()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, params, rows: res.rowCount })
  await db.release()
  return res
}


export default {
  query,
  migration,
  createDatabase,
  controllers,
  models
}