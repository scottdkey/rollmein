import { Logger } from "pino";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { RedisService } from "../redis/redis.service.js";

@addToContainer()
export class AuthService {
  private logger: Logger;
  constructor(
    private config: ConfigService,
    private ls: LoggerService,
    private redis: RedisService
  ) {
    this.logger = this.ls.getLogger(AuthService.name);
  }

  validateAuth = async (token: string): Promise<boolean> => {
    const serverToken = this.validateIfServerKey(token);
    if (serverToken) return serverToken;
    const sessionToken = await this.validateIfSessionKey(token);
    if (sessionToken) return sessionToken;
    this.logger.info(sessionToken);

    this.logger.debug("unable to validate token");
    return false;
  };

  private validateIfServerKey = (token: string) => {
    const serverToken = this.config.serverConfig.websocketKey;
    if (serverToken === token) {
      this.logger.debug({}, "api server connected");
      return true;
    }
    return false;
  };
  private validateIfSessionKey = async (token: string) => {
    const session = await this.redis.get<User>("session", token);
    if (session === null) {
      return false;
    }
    if (session) {
      this.logger.info(
        {
          id: session.id,
          username: session.username,
        },
        "user connected"
      );
      return true;
    }
    return false;
  };
}
