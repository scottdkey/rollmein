
import { addToContainer } from "../container";
import { ValidateRequestBody } from "./auth.router";
import { IFirebaseInfo } from "../types/context";
import { User, } from "../types/user";
import { ApplicationErrorResponse } from "../utils/errorsHelpers";
import { UserService } from "../user/user.service";
import { DataResponse } from "../types/DataResponse";
import { SessionService } from "../session/session.service";
import { Logger, LoggerService } from "../common/logger.service";

@addToContainer()
export class AuthService {
  private logger: Logger
  constructor(private userService: UserService, private sessionService: SessionService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(AuthService.name)
  }

  async validateAuth(firebaseInfo: IFirebaseInfo, body: ValidateRequestBody) {
    const cookieInfo = this.sessionService.getCookieInfo()
    try {

      const userRes = await this.userService.ensureUserExists(body, firebaseInfo)
      const session = userRes.data && await this.login(userRes.data)
  

      if (userRes.data && session) {
        return {
          user: userRes.data,
          sessionId: session.data?.id,
          cookieInfo,
          success: true
        }
      }
      return {
        user: null,
        sessionId: null,
        cookieInfo,
        success: false
      }
    } catch (e) {
      this.logger.error({ message: 'broken service', error: e })
      return {
        user: null,
        sessionId: null,
        cookieInfo,
        success: false
      }
    }
  }

  async login(user: User): Promise<DataResponse<{ id: string | null }>> {
    try {
      const res = await this.sessionService.createSession(user)
      return {
        data: {
          id: res.id
        },
        error: res.error,
        success: res.success
      }
    } catch (e) {
      return ApplicationErrorResponse(new Error(e))
    }

  }
}