import { Logger, P } from "pino";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { WebSocket } from "ws";

@addToContainer()
export class WebsocketService {
  private logger: Logger;
  private retryCount = 0;
  private socket: WebSocket;
  constructor(private ls: LoggerService, private config: ConfigService) {
    this.logger = this.ls.getLogger(WebsocketService.name);
    this.init();
  }

  private init() {
    const { websocketPort, websocketHost, websocketKey } =
      this.config.serverConfig;
    const socket = new WebSocket(`${websocketHost}:${websocketPort}`, {});
    socket.on("open", async () => {
      this.logger.info("connection open");
      this.retryCount = 0;
      socket.emit("upgrade", { websocketKey });
    });
    socket.on("ping", () => {
      // this.logger.info({}, "ping");
      socket.pong();
    });

    socket.on("message", (data, isBinary) => {
      try {
        const parsed = JSON.parse(data.toString());
        const eventType = parsed.eventType;
        this.logger.info({ parsed, isBinary });
      } catch (e) {
        this.logger.error(e);
      }
    });

    socket.on("close", () => {
      if (this.retryCount > 5) {
        this.logger.warn({}, "disconnected from server");
        this.logger.warn(
          { retryCount: this.retryCount },
          "attempting to reconnect"
        );
        this.retryCount++;
        this.init();
      }
      setTimeout(() => {
        this.retryCount = 0;
        this.init();
      }, 5000);
    });

    socket.on("error", (e) => {
      this.logger.error({ ...e }, "websocket error");
    });
  }

  publish = async <T>(topic: string, data?: T[]) => {
    if (data) {
      const serialized = data.map((item) => {
        return JSON.stringify(item);
      });
      this.socket.emit(topic, serialized);
    }
  };
}
