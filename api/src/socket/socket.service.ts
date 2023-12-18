import { Logger } from "pino";
import { Socket, io } from "socket.io-client";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

@addToContainer()
export class SocketService {
  private logger: Logger;
  private retryCount = 0;
  io: Socket;
  constructor(private ls: LoggerService, private config: ConfigService) {
    this.logger = this.ls.getLogger(SocketService.name);
    this.init();
  }
  private init = async () => {
    const socket = io(
      `${this.config.serverConfig.websocketHost}:${this.config.serverConfig.websocketPort}`,
      {
        auth: {
          key: this.config.serverConfig.websocketKey,
        },
      }
    );
    socket.on("open", async () => {
      this.logger.debug("connection open");
      this.retryCount = 0;
    });
    socket.onAny((message) => {
      this.logger.info(message);
    });
    socket.on("close", async () => {
      this.logger.warn({}, "disconnected from server");
    });
    socket.on("reconnect_attempt", () => {
      this.io.connect();
      console.log(this.config.serverConfig);
      this.logger.warn(
        { retryCount: this.retryCount },
        "attempting to reconnect"
      );
      this.retryCount++;
    });
    socket.on("error", async (e) => {
      this.logger.error({ ...e }, "websocket error");
    });
    socket.connect();
    this.io = socket;
  };
}
