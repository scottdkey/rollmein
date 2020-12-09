import { Pool, Client } from "pg"
import { createDb, migrate } from "postgres-migrations"
import keys from "../config/keys"


const envdb = (env: string): string => {
  if (env === "production") {
    return keys.PROD_DB
  } else if (env === "test") {
    return keys.TEST_DB
  } else {
    return keys.DEV_DB
  }
}
console.log(keys)

let pool: Pool
const db = envdb(keys.NODE_ENV)
const createDatabase = async () => {
  const client = new Client({
    database: "postgres",
  })
  await client.connect()
  try {
    await createDb(db, { client })
    console.log("Database Created")
  }catch {
    console.log("error, database not found")
  }
  finally {
    await client.end()
  }
}
const migration = async () => {
  const client = new Client()
  await client.connect()
  try {
    await migrate({ client }, "build/src/db/migrations")
  } finally {
    await client.end()
  }
}
const query = async (text: string, params: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, params, duration, rows: res.rowCount })
  return res
}

const connect = async () => {
  await createDatabase
  await migration()
  pool = await new Pool()
}

export {
  pool,
  query,
  envdb,
  connect
}