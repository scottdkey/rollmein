import { RollService } from "./roll.service";
import { container } from "../container";
import Router from "koa-router";
import { LoggerService } from "../logger/logger.service";
import { RequireAuth } from "../common/middleware/requireAuth.middleware";
import { RollUtilities } from "./roll.utilities";
import { ParameterizedContext } from "koa";
import { HTTPCodes } from "../../../web/src/types/HttpCodes.enum";

const router = new Router({ prefix: "/roll" });

const rollService = container.get(RollService);
const rollUtilities = container.get(RollUtilities);
const logger = container.get(LoggerService).getLogger("rollRouter");

router.get(
  "/:groupId",
  RequireAuth,
  async (ctx: ParameterizedContext, next) => {
    try {
      const groupId = ctx.params.groupId;
      const userId = ctx.state.user.id as string;
      if (!groupId) {
        ctx.message = "must include a group id";
        ctx.status = HTTPCodes.BAD_REQUEST;
        ctx.body = null;
      }
      if (groupId && userId) {
        const rollReturn = await rollService.getRoll(groupId, userId);
        ctx.body = rollReturn;
        ctx.status = rollReturn ? HTTPCodes.OK : HTTPCodes.NOT_FOUND;
      }
    } catch (e) {
      logger.error(e);
      ctx.status = e.status ? e.status : HTTPCodes.UNPROCESSABLE_ENTITY;
      ctx.body = e;
    }
    await next();
  }
);

router.post(
  "/:groupId",
  RequireAuth,
  async (ctx: ParameterizedContext, next) => {
    try {
      const groupId = ctx.params.groupId;
      const userId = ctx.state.user.id as string;
      if (!groupId) {
        ctx.status = HTTPCodes.BAD_REQUEST;
        ctx.body = {
          data: null,
          error: "must include a group id",
          success: false,
        };
      }
      if (groupId && userId) {
        ctx.body = await rollService.roll(groupId, userId);
        ctx.status = HTTPCodes.OK;
      }
    } catch (e) {
      logger.error(e);
      ctx.status = e.status ? e.status : HTTPCodes.UNPROCESSABLE_ENTITY;
      ctx.body = e;
    }
    await next();
  }
);

router.get("/inCount", RequireAuth, async (ctx: ParameterizedContext, next) => {
  try {
    const requestBody = ctx.request.body;
    if (requestBody && requestBody.players) {
      const res = rollUtilities.inCount(requestBody.players as IPlayer[]);
      ctx.body = {
        data: res,
        error: null,
        success: false,
      };
      await next();
    }
  } catch (e) {
    ctx.throw(HTTPCodes.SERVER_ERROR, e);
  }
});

router.post("start", RequireAuth, async (ctx: ParameterizedContext, next) => {
  try {
    const body = ctx.request.body as {
      groupId: string | undefined;
    };
    if (body.groupId && ctx.state.validUser) {
      const userId = ctx.state.user.id as string;
      console.log({ userId, groupId: body.groupId, logger });
      const res = await rollService.startRoll(body.groupId);
      ctx.body = res;
    }

    if (!body.groupId) {
      ctx.throw(HTTPCodes.BAD_REQUEST, {
        message: "must include a group id",
        success: false,
      });
    }
  } catch (e) {
    logger.error({
      message: "error on starting roll",
      error: e,
    });
  }
  await next();
});

export default router;
