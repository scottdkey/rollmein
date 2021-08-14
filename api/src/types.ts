import { IDatabaseDriver, EntityManager, Connection } from "@mikro-orm/core";
import { Redis } from "ioredis"
import { ParameterizedContext } from "koa"
import { Options } from "./entites/Options";
import { User } from "./entites/User";


export type MyContext = {
  ctx: ParameterizedContext & { state: ExtendedState }
  redis: Redis
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

interface ExtendedState {
  user: User | null
  options?: Options
}
