import Router from 'koa-router'
import { container } from '../container';
import { AuthService } from './auth.service';

import { DefaultState, Next } from 'koa';
import { SessionService } from '../session/session.service';
import { ApplicationError } from '../utils/errorsHelpers';
import { LoggerService } from '../common/logger.service';
import { UserService } from '../user/user.service';
import { MyContext } from '../types/Context';
import { HTTPCodes } from '../types/HttpCodes.enum';


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
  async (ctx: MyContext<ValidateRequestBody, { user: ScrubbedUser, sessionId: string, success: boolean } | { error: IApplicationError, success: boolean }>, next: Next) => {

    try {
      const body = ctx.request.body
      console.log({ body })
      let user: User | null  = null
      switch (body.authType) {
        case AuthTypes.GOOGLE:
          user = await authService.validateGoogleOauth2(body.token)
          console.log({ user })
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
          success: true
        }

      }
      if(!user){
        ctx.body = {
          error: ApplicationError(`unable to validate auth`),
          success: false
        }
        ctx.status = HTTPCodes.UNAUTHORIZED
      }

    } catch (e) {
      logger.error({ message: 'unable to validate', error: e.message, stacktrace: e.stacktrace })
      ctx.body = {
        error: ApplicationError(`unable to validate auth -- ${e.message}`),
        success: false
      }
      ctx.status = HTTPCodes.SERVER_ERROR
    }

    await next()

  })

export default authRouter