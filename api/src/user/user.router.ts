import { UserService } from "./user.service.js";
import { container } from "../container.js";
import Router from "koa-router";
import { Next, ParameterizedContext } from "koa";
import { SessionService } from "../session/session.service.js";
import { PlayerService } from "../player/player.service.js";
import { RequireAuth } from "../middleware/requireAuth.middleware.js";
import { isAuth } from "../middleware/isAuth.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  isAuth,
  RequireAuth,
  async (ctx, next: Next) => {
    try {
      const body: { username: string | undefined } = ctx.request.body as
        | any
        | undefined;
      if (body && body.username) {
        const username = body.username as string;

        const sessionId = ctx.state.token as string;

        const res = await userService.updateProfile(username);

        if (sessionId && res.user && res.scrubbedUser) {
          await sessionService.setSession(sessionId, res.user);
          ctx.status = HTTPCodes.OK;
          ctx.body = res.scrubbedUser;
        }
        if (!sessionId) {
          ctx.status = HTTPCodes.SERVER_ERROR;
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
