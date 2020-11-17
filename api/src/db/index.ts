import { Pool } from "pg"
import keys from "../config/index"

const pool = new Pool();


const query = async (text: string, params: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}



const envdb = (env: string) => {
  if (env === "production") {
    return keys.PROD_DB
  } else if (env === "test") {
    return keys.TEST_DB
  } else {
    return keys.DEV_DB
  }
}

export {
  pool,
  query,
  envdb,
}