import { Redis } from "ioredis"
import { ParameterizedContext } from "koa"
import session from "koa-session"


export type MyContext = {
  ctx: ParameterizedContext & { session: ExtendedSession }
};

interface ExtendedSession extends session {
  userId: string | null

}
