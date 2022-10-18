import { SetOption } from "cookies";
import { addToContainer } from "../container";
import { ValidateRequestBody } from "../routers/auth.router";
import { UserContext } from "../routers/user.router";
import { IFirebaseInfo } from "../types/context";
import { DataResponse } from "../types/DataResponse";
import { RegisterUser, User } from "../types/user";
import { UnknownProblemError } from "../utils/errorsHelpers";
import { ConfigService } from "./config.service";
import { Logger, LoggerService } from "./logger.service";
import { UserService } from "./user.service";


@addToContainer()
export class AuthService {
  private logger: Logger
  private serverConfig: {
    [key: string]: any;
    dev: boolean;
    prod: boolean;
    test: boolean;
    cors_uri: string | undefined;
    port: number;
    secretKey: string;
    cookieName: string;
  }
  constructor(private userService: UserService, private ls: LoggerService, private config: ConfigService) {
    this.serverConfig = this.config.ServerConfig()
    this.logger = this.ls.getLogger(AuthService.name)

  }

  cookieOptions(): SetOption {
    return {
      httpOnly: true,
      domain: this.serverConfig.prod ? this.serverConfig.cors_uri : 'localhost',
      path: '/',
      secure: this.serverConfig.prod,
      sameSite: "lax",
      expires: new Date(new Date().getTime() + 3600000),
    }
  }

  login(ctx: UserContext): UserContext {
    if (ctx.state.user && ctx.state.validUser) {
      // const jwt = signJwt(ctx.state.user.id)
      // const now = new Date()
      // const expires = new Date(now.setTime(now.getTime() + (30 * 24 * 60 * 60 * 1000)))
      // ctx.cookies.set(this.serverConfig.cookieName, jwt, { domain: ctx.host, expires })

      ctx.cookies.set(this.serverConfig.cookieName, ctx.state.token, this.cookieOptions());
    } else {
      this.logger.error({ message: 'something went wrong when logging in' })
    }
    return ctx
  }

  logout(ctx: UserContext): UserContext {
    ctx.cookies.set(this.serverConfig.cookieName, null, { ...this.cookieOptions, expires: new Date() })
    ctx.state.user = null
    return ctx
  }

  async ensureUserExists(body: ValidateRequestBody, payload: IFirebaseInfo): Promise<DataResponse<User>> {
    try {
      let returnError: AppError = UnknownProblemError(new Error('unknown problem ocurred in #ensureUserExists'))
      const firebaseUser = await this.userService.getUserByFirebaseId(payload.firebaseId)
      
      if (firebaseUser.data && firebaseUser.success) {
        return firebaseUser
      }
      if (firebaseUser.error && !firebaseUser.success) {
        returnError = firebaseUser.error
      }
      if (!firebaseUser.data && !firebaseUser.success) {
        const registerUser: RegisterUser = {
          username: "",
          email: payload.email,
          googleId: payload.googleId || null,
          appleId: payload.appleId || null,
          firebaseId: payload.firebaseId,
          refreshToken: body.refreshToken

        }
        const registeredUser = await this.userService.register(registerUser)
        if (registeredUser.data && registeredUser.success) {
          return registeredUser
        }
        if (!registeredUser.success && registeredUser.error) {
          returnError = registeredUser.error
        }
      }
      return {
        data: null,
        success: false,
        error: returnError
      }
    } catch (e) {
      this.logger.error({ message: "error occurred on #ensureUserExists", ...e })
      return {
        data: null,
        success: false,
        error: e
      }
    }
  }
}