import { Redis } from "ioredis"
import { Request, Response } from "express"
import session from "koa-session"


export type MyContext = {
  ctx: DefaultContext & { session: modifiedSession }
};

interface modifiedSession extends Session {
  userId: string

}
