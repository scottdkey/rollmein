import { v4 } from "uuid";
import WebSocket from "ws";
import { container } from "./container.js";
import { LoggerService } from "./logger/logger.service.js";
import { clients } from "./index.js";

export interface RollWebsocket extends WebSocket {
  isAlive: boolean;
}

const logger = container.get(LoggerService).getLogger("ConnectionHandler");

export const ConnectionHandler = (
  ws: RollWebsocket,
  request: any,
  client: any
) => {
  ws.isAlive = true;
  const ip = request.socket.remoteAddress;
  const id = v4();

  logger.info(
    {
      ip,
      id,
    },
    "connection"
  );
  clients.set(id, client);
  ws.on("error", logger.error);

  ws.on("pong", () => {
    ws.isAlive = true;
  });
};
