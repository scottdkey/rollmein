import { addToContainer } from "../container";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { GoogleClientService } from "../googleClient/googleClient.service";
import { Logger } from "pino";
import { LoggerService } from "../logger/logger.service";
import { ErrorMessages } from "../utils/ErrorTypes.enum";
import { ErrorTypes } from "../types/ErrorCodes.enum";
import { IApplicationError } from "../types/ApplicationError";

@addToContainer()
export class AuthService {
  private logger: Logger
  constructor(private googleClient: GoogleClientService, private userService: UserService, private sessionService: SessionService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(AuthService.name)
  }

  async validateGoogleOauth2(token: string) {
    const googleResponse = await this.googleClient.verify(token)
    const googleUserId = googleResponse.getUserId()
    const payload = googleResponse.getPayload()
    if (googleResponse && googleUserId && payload) {

      const username = payload.name || "No Name Set"
      const email = payload.email || ""
      return await this.userService.getOrCreateUserByGoogleId(googleUserId, email, username)
    }

    return null
  }


  async login(user: User): Promise<{ sessionId: string | null, error: IApplicationError | null }> {
    try {
      return {
        sessionId: await this.sessionService.createSession(user),
        error: null
      }
    } catch (e) {
      const error: IApplicationError = {
        message: ErrorMessages.LoginError,
        stacktrace: e.stacktrace,
        context: '#authService.login',
        detail: "unable to login",
        type: ErrorTypes.APP_ERROR
      }
      this.logger.error(error)
      return {
        sessionId: null,
        error
      }
    }

  }
}