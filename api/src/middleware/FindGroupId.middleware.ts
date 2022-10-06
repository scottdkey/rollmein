import { Next } from "koa";
import { MiddlewareFn } from "type-graphql";
import { container } from "../container";
import { LoggerService } from "../services/logger.service";
import {MyContext} from "../types/context";

interface IPlayerRequest {
  groupId: string
}
const logger = container.get(LoggerService).getLogger('FindGroupIdMiddleware')
export async function HasGroupId<T>(ctx: MyContext<T>, next: Next): Promise<MiddlewareFn<MyContext<T>>> {
  if (ctx.state.user && ctx.request.body) {
    const requestData: IPlayerRequest = ctx.request.body
    logger.info(JSON.stringify(requestData))
  }
  return next()
}