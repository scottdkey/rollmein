import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import Cors from "cors";
import { config } from "dotenv";
import Express from "express";
import Session from "express-session";
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, PG_HOST, PG_PASS, PG_PORT, PG_USER, SECRET_KEY, __port__, __prod__, __uri__ } from "./constants";
import { Player } from "./entites/Player";
import { User } from "./entites/User";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";



config()



const main = async () => {

  await createConnection({
    type: 'postgres',
    username: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: PG_PORT,
    logging: true,
    synchronize: true,
    entities: [User, Player]
  })
  const app = Express();
  app.use(Cors({
    origin: __uri__ || "http://localhost:3000",
    credentials: true
  }))
  const RedisStore = connectRedis(Session)
  const redis = new Redis()
  app.use(Session({
    name: COOKIE_NAME,
    store: new RedisStore({ client: redis, disableTouch: true }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 year cookie
      httpOnly: true,
      sameSite: 'lax', //csrf
      secure: __prod__ //cookie only works in https
    },
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }))
  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
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