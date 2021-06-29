import { Client } from "pg"
import { createDb } from "postgres-migrations"
import { DATABASE_NAME, PG_USER } from "../constants"

export const createDatabase = async () => {
  const client = await new Client({
    database: PG_USER,
  })
  await client.connect().then(() =>
    createDb(DATABASE_NAME, { client })

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


