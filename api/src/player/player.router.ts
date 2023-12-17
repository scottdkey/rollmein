import { PlayerService } from "./player.service.js";
import { container } from "../container.js";
import Router from "koa-router";
import { Next, ParameterizedContext } from "koa";
import { RequireAuth } from "../middleware/requireAuth.middleware.js";
import { LoggerService } from "../logger/logger.service.js";
import { GroupCountService } from "../groupCount/groupCount.service.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

const router = new Router({ prefix: "/player" });
const playerService = container.get(PlayerService);
const groupCountService = container.get(GroupCountService);
const logger = container.get(LoggerService).getLogger("playerRouter");

router.get(
  "/:playerId",
  RequireAuth,
  async (ctx: ParameterizedContext, next) => {
    try {
      if (ctx.params.playerId) {
        const res = await playerService.getPlayerById(ctx.params.playerId);
        ctx.body = res;
        ctx.status = HTTPCodes.OK;
      }
      if (!ctx.params.playerId) {
        ctx.throw(
          HTTPCodes.NOT_FOUND,
          `no player with id ${ctx.params.playerId}`
        );
      }
      await next();
    } catch (e) {
      logger.error(e);
      ctx.throw(HTTPCodes.SERVER_ERROR, "not found");
    }
  }
);

router.put("/", RequireAuth, async (ctx, next: Next) => {
  try {
    const requestBody = ctx.request.body as IUpdatePlayer;
    const updateRes = await playerService.updatePlayer(requestBody);

    if (updateRes && updateRes.groupId) {
      await groupCountService.updateActiveGroupCounts(updateRes.groupId);
    }
    ctx.body = updateRes;
    ctx.status = HTTPCodes.OK;
    await next();
  } catch (e) {
    logger.error(e);
    ctx.body = e.message;
    ctx.status = HTTPCodes.SERVER_ERROR;
    await next();
  }
});

router.put("/userPlayer", RequireAuth, async (ctx, next: Next) => {
  try {
    const userId = ctx.state.user.id;
    const requestBody = ctx.request.body as IUpdatePlayer;
    const updateRes = await playerService.updateUserPlayer(
      requestBody as IUpdatePlayer,
      userId
    );
    ctx.body = updateRes;
    ctx.status = HTTPCodes.OK;
    await next();
  } catch (e) {
    logger.error(e);
    ctx.body = e.message;
    ctx.status = HTTPCodes.SERVER_ERROR;
    await next();
  }
});

router.get(
  "/:userId",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    try {
      const requestUserId = ctx.query.userId as string | undefined;
      if (requestUserId) {
        const player = await playerService.getPlayerByUserId(requestUserId);
        if (player) {
          ctx.body = player;
        }
        if (!player) {
          const error = {
            message: `unable to find player with userId:${requestUserId}`,
          };
          logger.error(error);
          ctx.throw(HTTPCodes.NOT_FOUND, error);
        }
      }
    } catch (e) {
      logger.error(e);
    }
    await next();
  }
);

router.get(
  "/group/:groupId",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    try {
      const groupId = ctx.params.groupId as string | undefined;
      if (groupId) {
        const players = await playerService.getPlayersByGroupId(groupId);
        if (players) {
          ctx.body = players;
          ctx.status = HTTPCodes.OK;
        }
        if (!players) {
          ctx.body = [];
          ctx.status = HTTPCodes.NOT_FOUND;
        }
      }
      if (!groupId) {
        ctx.throw(HTTPCodes.BAD_REQUEST, "no groupId provided");
      }
    } catch (e) {
      logger.error(e);
      ctx.status = HTTPCodes.SERVER_ERROR;
      ctx.body = e;
    }
    await next();
  }
);

export default router;
