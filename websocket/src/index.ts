import "reflect-metadata";
import { container } from "./container.js";
import { ConfigService } from "./config/config.service.js";
import { LoggerService } from "./logger/logger.service.js";
import http from "http";
import Express from "express";
import { Server as SocketServer } from "socket.io";
import { indexRouter } from "./index/index.router.js";
import { indexSocket } from "./index/index.socket.js";
import { RequestLogger } from "./middleware/request.logger.js";
import helmet from "helmet";
import { AuthService } from "./auth/auth.service.js";

const config = container.get(ConfigService).serverConfig;
const logger = container.get(LoggerService).getLogger("index.ts");
const app = Express();
const socketHttp = http.createServer(app);
export const socketServer = new SocketServer(socketHttp);
const routers = [{ router: indexRouter, route: "/", name: "index" }];
app.use(helmet());
app.use(RequestLogger);

routers.forEach((r) => {
  logger.debug(`added ${r.name} router`);
  app.use(r.route, r.router);
});
const server = async () => {
  try {
    socketServer.on("connection", async (socket) => {
      const authService = container.get(AuthService);
      const validAuth = await authService.validateAuth(
        socket.handshake.auth.key
      );
      if (!validAuth) {
        socket.disconnect();
      }

      //log any message
      socket.onAny((eventName, ...args) => {
        logger.debug(args, eventName);
      });
      //how to split logic
      indexSocket(socketServer, socket);

      socket.on("disconnect", () => {
        logger.info(`${socket.handshake.auth.key} disconnected`);
      });
    });
    socketHttp.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          url: `https://${config.baseUrl}:${config.port}`,
        },
        `socket server started`
      );
    });
  } catch (e) {
    logger.error(e, "server error");
  }
};

await server();
