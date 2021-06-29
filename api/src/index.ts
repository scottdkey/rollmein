import { ApolloServer } from "apollo-server-express";
import { config } from "dotenv";
import Express from "express"
import { cors } from "./cors"
import { db } from "./db"
import { session, redis } from "./session";
import { buildSchema } from "type-graphql";
import 'reflect-metadata';
import { __port__, __prod__, __uri__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { PlayerResolver } from "./resolvers/player";
import { UserOptionsResolver } from "./resolvers/userOptions";
import { createDatabase } from "./utils/createDatabase";

config()
const main = async () => {
  if (!__prod__) {
    await createDatabase()
  }
  await db()
  const app = Express();
  app.use(cors)
  app.use(session)
  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PlayerResolver, UserOptionsResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res, redis })

  })
  apollo.applyMiddleware({ app, cors: false })
  app.listen(__port__, () => {
    console.log(`Listening on Port ${__port__}`)
  }).on("Error", (err) => {
    console.error("Error:", err)
  })

}

export default main()