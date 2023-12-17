import { addToContainer } from "../container.js";
import { UserService } from "../user/user.service.js";
import { SessionService } from "../session/session.service.js";
import { GoogleClientService } from "../googleClient/googleClient.service.js";
import { Logger } from "pino";
import { LoggerService } from "../logger/logger.service.js";
import { IApplicationError } from "../types/ApplicationError.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { ErrorMessages } from "../types/ErrorTypes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

@addToContainer()
export class AuthService {
  private logger: Logger;
  constructor(
    private googleClient: GoogleClientService,
    private userService: UserService,
    private sessionService: SessionService,
    private ls: LoggerService
  ) {
    this.logger = this.ls.getLogger(AuthService.name);
  }

  async validateGoogleOauth2(token: string) {
    const googleResponse = await this.googleClient.verify(token);
    const googleUserId = googleResponse.getUserId();
    const payload = googleResponse.getPayload();
    this.logger.debug({ googleResponse, googleUserId, payload });
    if (googleResponse && googleUserId && payload) {
      const username = payload.name || "No Name Set";
      const email = payload.email || "";
      return await this.userService.getOrCreateUserByGoogleId(
        googleUserId,
        email,
        username
      );
    }

    return null;
  }

  async login(
    user: User
  ): Promise<{ sessionId: string | null; error: IApplicationError | null }> {
    try {
      return {
        sessionId: await this.sessionService.createSession(user),
        error: null,
      };
    } catch (e) {
      const error: IApplicationError = {
        message: ErrorMessages.LoginError,
        stacktrace: e.stacktrace,
        context: "#authService.login",
        detail: "unable to login",
        type: ErrorTypes.APP_ERROR,
        status: HTTPCodes.NOT_AUTHORIZED,
      };
      this.logger.error(error);
      return {
        sessionId: null,
        error,
      };
    }
  }
}
