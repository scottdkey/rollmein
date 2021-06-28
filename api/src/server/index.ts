import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { session } from "../db/redis";
import playerRoutes from "../routes/players";
import userRoutes from "../routes/users";
import indexRoutes from "../routes/index"
import userOptionsRoutes from "../routes/userOptions"
import rollRoutes from "../routes/rolls"
import { createConnection } from 'typeorm';
import { User } from '../db/entities/user';

import { __port__, SECRET_KEY, __prod__, DATABASE_NAME, PG_USER, PG_PASS, PG_HOST, PG_PORT } from '../constants';


export async function main() {
  const app: Koa = new Koa();
  app.use(bodyParser({}));


  await createConnection({
    type: 'postgres',
    database: DATABASE_NAME,
    username: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: PG_PORT,
    logging: true,
    synchronize: true,
    entities: [User]
  })

  //sessions

  app.keys = [SECRET_KEY]
  app.use(session);


  //routes
  app.use(indexRoutes.routes())
  app.use(userRoutes.routes());
  app.use(playerRoutes.routes());
  app.use(userOptionsRoutes.routes())
  app.use(rollRoutes.routes())



  // server
  app.listen(__port__, () => {
    console.log(`Server listening on port: ${__port__}`);
  });

}



