import "dotenv/config";
import 'reflect-metadata';
import { ApolloServer } from "apollo-server-koa";
import cors from "koa-cors";
import Redis from 'ioredis';
import Koa from "koa";
import bodyParser from "koa-bodyparser";
// import koaJwt from "koa-jwt"
import { buildSchema } from "type-graphql";
import { __cookieName__, __secretKey__, __port__, __prod__, __redisHost__, __uri__, __test__ } from "./constants";
import { HelloResolver } from "./resolvers/hello";
import { PlayerResolver } from "./resolvers/player";
import { UserResolver } from "./resolvers/user";
import { OptionsResolver } from "./resolvers/options";
import { MyContext } from "./types";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config"
import { createDatabase } from './utils/createDatabase';
import { kubeRouter } from './routes/kubernetesRoutes';
import { jwtSetUserOrFail } from "./utils/jwtUtils";


export let serverOn = false
export const redis = new Redis({
  host: __redisHost__
});
let orm: MikroORM
async function dbSetup() {
  if (!__prod__) {
    await createDatabase()
  }
  if (!__test__) {
    orm = await MikroORM.init(microConfig);
  }
}
dbSetup()


const app = new Koa();

app.use(bodyParser())
app.use(kubeRouter.routes())
app.use(
  cors({
    origin: __uri__,
    credentials: true
  })
)
// app.use(koaJwt({ secret: __secretKey__, passthrough: true }))
const apolloServer = async () => new ApolloServer({
  playground: !__prod__,
  schema: await buildSchema({
    resolvers: [
      HelloResolver,
      UserResolver,
      PlayerResolver,
      OptionsResolver],
    validate: true,
  }),
  context: ({ ctx }: MyContext) => {
    jwtSetUserOrFail(ctx, orm.em)
    return {
      ctx,
      redis,
      em: orm.em.fork(),
    }
  }
});

apolloServer().then(apollo => {
  apollo.applyMiddleware({
    app,
    cors: false,
  });
})

let PORT = __test__ ? 9000 : __port__


export const server = app.listen(PORT, () => {
  const message = __prod__ ? "server started on https://rollmein.scottkey.dev/graphql" : `server started on http://localhost:${PORT}/graphql`
  !__test__ ? console.log(message) : null
  serverOn = true
});
