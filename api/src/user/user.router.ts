import { UserService } from "./user.service";
import { container } from "../container";
import Router from "koa-router";
import { Next, ParameterizedContext } from "koa";
import { SessionService } from "../session/session.service";
import { PlayerService } from "../player/player.service";
import { RequireAuth } from "../common/middleware/requireAuth.middleware";
import { isAuth } from "../common/middleware/isAuth";
import { HTTPCodes } from "../../../web/src/types/HttpCodes.enum";

const router = new Router({
  prefix: "/user",
});
const userService = container.get(UserService);
const sessionService = container.get(SessionService);
const playerService = container.get(PlayerService);

router.get("/me", RequireAuth, async (ctx, next) => {
  const user = ctx.state.user;
  if (user) {
    ctx.body = {
      user: userService.scrubUser(ctx.state.user),
      success: true,
    };
    ctx.status = HTTPCodes.OK;
  }

  await next();
});

router.put(
  "/profile",
  isAuth,
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    try {
      if (ctx.request.body && ctx.request.body.username) {
        const username = ctx.request.body.username as string;

        const sessionId = ctx.state.token as string;

        const res = await userService.updateProfile(username);

        if (sessionId && res.user && res.scrubbedUser) {
          await sessionService.setSession(sessionId, res.user);
          ctx.status = HTTPCodes.OK;
          ctx.body = res.scrubbedUser;
        }
        if (!sessionId) {
          ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR;
          ctx.body = {
            error: "Error updating profile",
          };
        }
      }
      ctx.throw(HTTPCodes.BAD_REQUEST, "unable to find username in request");
    } catch (e) {
      ctx.throw(HTTPCodes.SERVER_ERROR, e);
    }

    await next();
  }
);

router.get(
  "/player",
  RequireAuth,
  async (ctx: ParameterizedContext, next: Next) => {
    try {
      const userId = ctx.state.user?.id as string;
      const player = await playerService.getPlayerByUserId(userId);
      if (player) {
        ctx.status = HTTPCodes.OK;
        ctx.body = player;
      }
      if (!player) {
        ctx.status = HTTPCodes.NOT_FOUND;
        ctx.body = {
          error: "No player found",
        };
      }

      await next();
    } catch (e) {
      throw (HTTPCodes.SERVER_ERROR, e);
    }
  }
);

export default router;
