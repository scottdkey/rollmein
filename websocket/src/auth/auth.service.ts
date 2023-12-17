import { Logger } from "pino";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

@addToContainer()
export class AuthService {
  private logger: Logger;
  constructor(private config: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(AuthService.name);
  }

  validateAuth = async (token: string): Promise<boolean> => {
    const serverToken = this.config.serverConfig.websocketKey;
    if (serverToken === token) {
      this.logger.debug("server connection open");
      return true;
    }
    this.logger.debug("unable to validate token");
    return false;
  };
}
