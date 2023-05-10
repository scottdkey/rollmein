import { Next } from "koa";
import { LoggerService } from "../../logger/logger.service";
import { container } from "../../container";
import { MyContext } from "../../../../shared/types/Context";



const logger = container.get(LoggerService).getLogger('isAuthLogger')

export async function RequestLogger(ctx: MyContext<any, any>, next: Next) {
  try {
    logger.info({ message: 'request', url: ctx.url, method: ctx.method, body: ctx.request.body })
    
  } catch (e) {
    logger.error(e)
  }
  await next()
}