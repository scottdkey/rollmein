import { Logger } from "pino";
import { Socket, io } from "socket.io-client";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

@addToContainer()
export class SocketService {
  private logger: Logger;
  socketConnection: Socket;
  constructor(
    private ls: LoggerService,
    private config: ConfigService,
  ) {
    this.logger = this.ls.getLogger(SocketService.name);
    this.init();
  }
  init = async () => {
    const socket = io(
      `${this.config.serverConfig.websocketHost}:${this.config.serverConfig.websocketPort}`,
      {
        auth: {
          key: this.config.serverConfig.websocketKey,
        },
      }
    );
    socket.io.on("open", async () => {
      this.logger.info("connection open");
    });
    socket.io.on("close", async () => {
      this.logger.info("connection closed");
    });
    this.socketConnection = socket;
    this.connect().catch((e) => {
      this.logger.error(e, "unable to connect to socket");
    });
  };

  connect = async () => {
    await this.socketConnection.connect();
    this.logger.info("socket connected");
  };
}
