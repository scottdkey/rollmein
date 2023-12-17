import { Context, Next } from "koa";
import { LoggerService } from "../logger/logger.service.js";
import { container } from "../container.js";

const logger = container.get(LoggerService).getLogger("RequestLogger");

export async function RequestLogger(ctx: Context, next: Next) {
  try {
    logger.debug(
      {
        httpVersion: ctx.req.httpVersion,
        userAgent: ctx.headers["user-agent"],
        accept: ctx.headers.accept,
        acceptEncoding: ctx.headers["accept-encoding"],
        host: ctx.headers.host,
        reqUrl: ctx.URL,
        body: ctx.body,
        params: ctx.query,
      },
      "request"
    );
    await next();
    logger.debug(
      {
        status: ctx.status,
        headers: ctx.headers,
        body: ctx.body,
      },
      "response"
    );
  } catch (err) {
    logger.error(err);
    ctx.status = err.status;
    ctx.message = err.message;
  }
}
