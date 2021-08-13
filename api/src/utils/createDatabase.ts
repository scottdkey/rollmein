import { Client } from "pg"
import { createDb } from "postgres-migrations"
import { __dbName__, __pgHost__, __pgPass__, __pgPort__, __pgUser__ } from "../constants"

export const createDatabase = async () => {
  const client = await new Client({
    user: __pgUser__,
    host: __pgHost__,
    password: __pgPass__,
    port: __pgPort__,
    database: __pgUser__,
  })
  await client.connect().then(() =>
    createDb(__dbName__, { client })

  ).catch((e) => {
    console.log(e.stack)
    setTimeout(() => {
      console.error('Retrying Connection in 3 seconds', `error: ${e}`)
      createDatabase()
    }, 3000)
  }).finally(() =>
    client.end()
  )
}


