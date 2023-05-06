import { DefaultState, Next } from 'koa';
import Router from 'koa-router';
import { container } from '../container';
import { LoggerService } from '../logger/logger.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { createError } from '../utils/CreateError';
import { ErrorMessages } from '../../../shared/types/ErrorTypes.enum';
import { IApplicationError } from '../../../shared/types/ApplicationError';
import { MyContext } from '../../../shared/types/Context';
import { ErrorTypes } from '../../../shared/types/ErrorCodes.enum';
import { HTTPCodes } from '../../../shared/types/HttpCodes.enum';


const authService = container.get(AuthService)
const sessionService = container.get(SessionService)
const userService = container.get(UserService)
const authRouter = new Router<DefaultState, MyContext<any, any>>({ prefix: '/auth' })
const logger = container.get(LoggerService).getLogger('authRouter')

export interface ValidateRequestBody {
  authType: AuthTypes.GOOGLE | AuthTypes.GITHUB,
  token: string
}
export enum AuthTypes {
  GOOGLE = 'google',
  GITHUB = 'Github'
}

authRouter.post("/validate",
  async (ctx: MyContext<ValidateRequestBody, { user: ScrubbedUser | null, sessionId: string | null, success: boolean, error: IApplicationError | null }>, next: Next) => {

    try {
      const body = ctx.request.body
      let user: User | null = null
      switch (body.authType) {
        case AuthTypes.GOOGLE:
          user = await authService.validateGoogleOauth2(body.token)
          break
        default:
          logger.error({
            message: "no strategy specified",
            authType: body.authType
          })
      }
      if (user) {
        const sessionId = await sessionService.createSession(user)
        ctx.state.user = {
          ...user,
          sessionExpires: ""
        }
        ctx.state.validUser = true
        ctx.body = {
          user: userService.scrubUser(user),
          sessionId,
          success: true,
          error: null
        }

      }
      if (!user) {
        const error = createError({
          message: ErrorMessages.AuthorizationError,
          type: ErrorTypes.USER_ERROR,
          context: "authRouter.validate",
          detail: "unable to validate auth"
        })
        ctx.body = {
          error,
          success: false,
          user: null,
          sessionId: null
        }
        ctx.status = HTTPCodes.UNAUTHORIZED
      }

    } catch (e) {


      const error = createError({
        message: ErrorMessages.AuthorizationError,
        type: ErrorTypes.USER_ERROR,
        context: "authRouter.validate",
        detail: e.message,
        stacktrace: e.stacktrace
      })

      logger.error(error)
      ctx.body = {
        error,
        success: false,
        user: null,
        sessionId: null
      }
      ctx.status = HTTPCodes.SERVER_ERROR
    }

    await next()

  })

export default authRouter