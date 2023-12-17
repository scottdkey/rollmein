import { Next } from "koa";
import Router from "koa-router";
import { container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { SessionService } from "../session/session.service.js";
import { UserService } from "../user/user.service.js";
import { AuthService } from "./auth.service.js";
import { createError } from "../utils/CreateError.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { ErrorMessages } from "../types/ErrorTypes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";
import { ConfigService } from "../config/config.service.js";
import { z } from "zod";

const authService = container.get(AuthService);
const sessionService = container.get(SessionService);
const userService = container.get(UserService);
const authRouter = new Router({
  prefix: "/auth",
});
const logger = container.get(LoggerService).getLogger("authRouter");

export interface ValidateRequestBody {
  authType: AuthTypes.GOOGLE | AuthTypes.GITHUB;
  token: string;
}
export enum AuthTypes {
  GOOGLE = "google",
  GITHUB = "Github",
}

authRouter.post("/validate", async (ctx, next: Next) => {
  try {
    const body = ctx.request.body as {
      token: string;
      authType: AuthTypes;
    };
    let user: User | null = null;
    if (body && body.token) {
      switch (body.authType) {
        case AuthTypes.GOOGLE:
          user = await authService.validateGoogleOauth2(body.token);
          logger.info({ message: "validated google oauth2", user });
          break;
        default:
          logger.error({
            message: "no strategy specified",
            authType: body.authType,
          });
      }
    }
    if (user) {
      const sessionId = await sessionService.createSession(user);
      ctx.state.user = {
        ...user,
        sessionExpires: "",
      };
      ctx.state.validUser = true;
      ctx.body = {
        user: userService.scrubUser(user),
        sessionId,
        success: true,
        error: null,
      };
    }
    if (!user) {
      const error = createError({
        message: ErrorMessages.AuthorizationError,
        type: ErrorTypes.USER_ERROR,
        context: "authRouter.validate",
        detail: "unable to validate auth",
        status: HTTPCodes.NOT_AUTHORIZED,
      });
      ctx.body = {
        error,
        success: false,
        user: null,
        sessionId: null,
      };
      ctx.status = HTTPCodes.NOT_AUTHORIZED;
    }
  } catch (e) {
    const error = createError({
      message: ErrorMessages.AuthorizationError,
      type: ErrorTypes.USER_ERROR,
      context: "authRouter.validate",
      detail: e.message,
      stacktrace: e.stacktrace,
      status: HTTPCodes.SERVER_ERROR,
    });

    logger.error(error);
    ctx.body = {
      error,
      success: false,
      user: null,
      sessionId: null,
    };
    ctx.status = HTTPCodes.SERVER_ERROR;
  }

  await next();
});

authRouter.post("/devSession", async (ctx, next) => {
  const config = container.get(ConfigService);
  const DevSession = z.object({
    devKey: z.string().uuid(),
  });

  try {
    const parsedBody = DevSession.parse(ctx.request.body);
    const devKey = config.serverConfig.devKey;
    const authorized = devKey !== null && parsedBody.devKey === devKey;
    const user = await userService.getById(
      "c17ef89d-080e-48f2-be67-612b6c917133"
    );

    if (authorized && user) {
      const sessionId = await sessionService.createSession(user);
      ctx.body = {
        sessionId,
      };
      ctx.status = HTTPCodes.CREATED;
    }
    if (!authorized) {
      ctx.status = HTTPCodes.NOT_AUTHORIZED;
    }
    if (!user) {
      ctx.status = HTTPCodes.NOT_FOUND;
      ctx.body = "unable to find dev user";
    }
    await next();
  } catch (e) {
    logger.error(e, "unable to get token");
    ctx.status = HTTPCodes.SERVER_ERROR;
    ctx.body = "unable to get token";
  }
});

export default authRouter;
