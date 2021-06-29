import { Pool, Client, QueryResult } from "pg"
import { DATABASE_NAME } from "../constants"

export const createDB = async () => {
  const client = await new Client({
    database: process.env.PGUSER,
  })
  await client.connect().then(() =>
    createDB(DATABASE_NAME, { client })

  ).catch((e) => {
    console.log(e.stack)
    setTimeout(() => {
      //if it cannot connect to postgres loop
      console.error('Retrying Connection in 3 seconds')
      createDB()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}
export const dbMigration = async (): Promise<void> => {
  const client = new Client({})
  await client.connect().then(async () => {
    await migrate({ client }, "dist/db/migrations")
  }).catch((e) => {
    console.log(e.stack)
    setTimeout(() => {
      console.log("Retrying Connection in 3 seconds")
      dbMigration()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}

const pool = new Pool()
export const query = async (text: string, params: any[]): Promise<QueryResult<any>> => {
  const start = Date.now()
  const db = await pool.connect()
  const res = await db.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, params, rows: res.rowCount })
  await db.release()
  return res
}


export {
  controllers,
  models
}