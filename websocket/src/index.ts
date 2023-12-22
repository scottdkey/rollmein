import "reflect-metadata";
import { container } from "./container.js";
import { ConfigService } from "./config/config.service.js";
import { LoggerService } from "./logger/logger.service.js";
import http from "http";
import * as Express from "express";
import { RequestLogger } from "./middleware/request.logger.js";
import helmet from "helmet";
import { RegisterRouters } from "./routers.js";
import ws, { WebSocket, WebSocketServer } from "ws";
import { v4 } from "uuid";
import { RollWebsocket } from "./connection.handler.js";
import { getPingInterval } from "./utils/serverInterval.js";

export type HandleUpgrade = typeof ws.Server<
  typeof ws,
  typeof http.IncomingMessage
>;

const logger = container.get(LoggerService).getLogger("Application");

export const clients = new Map();

const server = async () => {
  try {
    const configService = container.get(ConfigService);
    const config = configService.serverConfig;
    const webSocketConfig = configService.webSocketConfig;

    const app = Express.default();
    const socketHttp = http.createServer(app);

    const wss = new WebSocketServer(webSocketConfig);

    app.use(helmet());
    app.use(RequestLogger);
    RegisterRouters(app);

    const interval = getPingInterval(wss);

    wss.on("connection", (ws: RollWebsocket, request: any, client: any) => {
      ws.isAlive = true;
      const ip = request.socket.remoteAddress;
      const id = v4();
      const authorized = false;
      logger.info(
        {
          ip,
          id,
        },
        "connection"
      );
      ws.on("error", logger.error);

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (data, isBinary) => {
        try {
          if (ws.isAlive === false) ws.terminate();
          wss.clients.forEach(function each(client) {
            if (
              authorized &&
              client !== ws &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(data, { binary: isBinary });
            }
            if (!authorized) {
              ws.emit("HTTP/1.1 401 Unauthorized\r\n\r\n");
              ws.terminate();
              clearInterval(interval);
              logger.info({ id }, "not authorized, connection terminated");
            }
          });
        } catch (e) {
          logger.error(e, "message error");
        }
        logger.info({
          authorized,
          clients: id,
        });
      });
    });

    wss.on("close", () => {
      clearInterval(interval);
      logger.info({}, "connection closed");
    });
    wss.on("Upgrade", (request, socket, head) => {
      const Unauthorized = () => {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
      };
      socket.on("error", (err: any) => {
        logger.error(err, "upgrade error");
        Unauthorized();
      });
      socket.removeListener("error", logger.error);
      logger.info({ request, socket, head });
      const client = request.client;
      if (!client) {
        Unauthorized();
      }
    });

    socketHttp.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          url: `https://${config.baseUrl}:${config.port}`,
          socket: `ws://${config.baseUrl}:8080`,
        },
        `socket server started`
      );
    });
  } catch (e) {
    logger.fatal(e, "fatal server error");
  }
};

await server();
