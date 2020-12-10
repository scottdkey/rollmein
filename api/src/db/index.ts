import { TIMEOUT } from "dns"
import { create } from "domain"
import { Pool, Client } from "pg"
import { createDb, migrate } from "postgres-migrations"
import keys from "../config/keys"


const envdb = (env: string) => {
  let working_database = "placeholder"
  if (env === "production") {
    working_database = keys.PRODUCTION_DATABASE
  } else if (env === "test") {
    working_database = keys.TEST_DATABASE
  } else {
    working_database = keys.DEVELOPMENT_DATABASE
  }
  process.env.PGDATABASE = working_database
  return working_database
}

let pool: Pool
const db = envdb(keys.NODE_ENV)
const createDatabase = async () => {
  const client = new Client({
    database: keys.PGUSER,
  })
  await client.connect().then(res =>
    createDb(db, { client })
  ).catch((err) => {
    console.log("Error: Database connection could not be established", err)
  }).finally(async () =>
    await client.end()
  )
}
const migration = async () => {
  const client = await new Client({})
  await client.connect()
  try {
    await migrate({ client }, "build/db/migrations")
  } catch {
    console.log("Migration Error")
  }
  finally {
    console.log(`Migration complete`)
    await client.end()
  }
}
const query = async (text: string, params: any[]) => {
  const start = Date.now()
  const db = await pool.connect()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, params, duration, rows: res.rowCount })
  await db.release
  return res
}



const connect = async () => {
  await createDatabase()
  pool = await new Pool()
  console.log(`Connected to database ${process.env.PGDATABASE}`)
  await migration()

}


export {
  pool,
  query,
  envdb,
  connect,
}