import { Next } from "koa";
import { container } from "../container";
import { LoggerService } from "../common/logger.service";
import { MyContext } from "../types/Context";

interface IPlayerRequest {
  groupId: string
}
const logger = container.get(LoggerService).getLogger('FindGroupIdMiddleware')

export async function HasGroupId<T>(ctx: MyContext<IPlayerRequest, T>, next: Next): Promise<MyContext<IPlayerRequest, T>> {
  if (ctx.state.user && ctx.request.body) {
    const requestData = ctx.request.body
    logger.info({ message: "", ...requestData })
  }
  return next()
}