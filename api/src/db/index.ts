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

let pool: Pool

const migration = async () => {
  const db = envdb(keys.NODE_ENV)
  const dbConfig = {
    database: db,
    user: keys.PGUSER,
    password: keys.PGPASS,
    host: keys.PGHOST,
    port: parseInt(keys.PGPORT),
  }

  {
    const client = new Client({
      ...dbConfig,
      database: "postgres",
    })
    await client.connect()
    try {
      await createDb(db, { client })
    } catch {
      console.log("Error: no database connection")
    }
    finally {
      await client.end()
    }
  }

  {
    const client = new Client(dbConfig) // or a Pool, or a PoolClient
    await client.connect()
    try {
      await migrate({ client }, "build/src/db/migrations")
    } catch {
      console.log("Error: no database connection")
    } finally {
      await client.end()
    }
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
  await migration()
  pool = await new Pool()
}

export {
  pool,
  query,
  envdb,
  connect
}