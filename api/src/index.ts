import { ApolloServer } from "apollo-server-koa";
import cors from "koa-cors";
import { config } from "dotenv";
import Redis from 'ioredis';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import redisStore from "koa-redis";
import session from "koa-session";
import 'reflect-metadata';
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, DATABASE_NAME, PG_HOST, PG_PASS, PG_PORT, PG_USER, SECRET_KEY, __port__, __prod__ } from "./constants";
import { Player } from "./entites/Player";
import { User } from "./entites/User";
import { UserOptions } from "./entites/UserOptions";
import { HelloResolver } from "./resolvers/hello";
import { PlayerResolver } from "./resolvers/player";
import { UserResolver } from "./resolvers/user";
import { UserOptionsResolver } from "./resolvers/userOptions";
import { createDatabase } from "./utils/createDatabase";
import { MyContext } from "./types";

config()

export const redis = new Redis();
const main = async () => {
  if (!__prod__) {
    await createDatabase()
  }

  await createConnection({
    type: "postgres",
    database: DATABASE_NAME,
    username: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: PG_PORT,
    logging: true,
    synchronize: true,
    entities: [UserOptions, Player, User],
  });
  // await conn.runMigrations();

  // await Post.delete({});

  const app = new Koa();
  app.use(bodyParser())
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000"
    })
  );
  app.keys = [SECRET_KEY]
  app.use(
    session({
      key: COOKIE_NAME,
      store: redisStore({
        client: redis
      }),
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __prod__, // cookie only works in https
    }, app)
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PlayerResolver, UserOptionsResolver],
      validate: true,
    }),
    context: ({ ctx }: MyContext) => {
      return {
        session: ctx.session
      }
    }
  });

  apolloServer.applyMiddleware({ app, cors: false, });

  app.listen(__port__, () => {
    console.log(`server started on localhost:${__port__}`);
  });

}

export default main()