import { Client } from "pg"
import { createDb } from "postgres-migrations"
import { __dbName__, __pgUser__ } from "../constants"

export const createDatabase = async () => {
  const client = await new Client({
    database: __pgUser__,
  })
  await client.connect().then(() =>
    createDb(__dbName__, { client })

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


