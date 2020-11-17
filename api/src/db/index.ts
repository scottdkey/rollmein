import { Pool } from "pg"
import keys from "../config/index"

const pool = new Pool();

const envdb = (env: string) => {
  if (env === "production") {
    return keys.PROD_DB
  } else if (env === "test") {
    return keys.TEST_DB
  } else {
    return keys.DEV_DB
  }
}
const query = async (text: string, params: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

export {
  pool,
  query,
  envdb,
}