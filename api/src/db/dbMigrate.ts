import { createDb, migrate } from "postgres-migrations"
import { envdb } from "./index"
import keys from "../config/index"

const createAndMigrate = async () => {
  const db = envdb(keys.NODE_ENV)
  const dbConfig = {
    database: db,
    user: keys.PGUSER,
    password: keys.PGUSER,
    host: keys.PGHOST,
    port: parseInt(keys.PGPORT),
  }
  await createDb(db, { ...dbConfig, defaultDatabase: "postgres" })
  await migrate(dbConfig, `./src/db/migrations`)
  console.log("Migrations up to date")
}

export default createAndMigrate