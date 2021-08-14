import { IDatabaseDriver, EntityManager, Connection } from "@mikro-orm/core";
import { Redis } from "ioredis"
import { ParameterizedContext } from "koa"
import { Session } from "koa-session"


export type MyContext = {
  ctx: ParameterizedContext & { session: ExtendedSession }
  redis: Redis
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  id: string
};

interface ExtendedSession extends Session {
  userId: string | null

}
