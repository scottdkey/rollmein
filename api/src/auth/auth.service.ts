import { addToContainer } from "../container";
import { ApplicationError } from "../utils/errorsHelpers";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { Logger, LoggerService } from "../common/logger.service";
import { GoogleClientService } from "../googleClient/googleClient.service";
import { User } from "../../../types/user";

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


  async login(user: User) {
    try {
      return {
        sessionId: await this.sessionService.createSession(user),
        error: null
      }
    } catch (e) {
      this.logger.error({ message: 'unable to login', error: e.message, stacktrace: e.stacktrace })
      return {
        sessionId: null,
        error: ApplicationError(e.message)
      }
    }

  }
}