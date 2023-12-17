import { Server, Socket } from "socket.io";
import { container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

const logger = container.get(LoggerService).getLogger("Index");

export const indexSocket = (io: Server, socket: Socket) => {
  const namespace = io.of("/index");
  namespace.on("/message", (data: any) => {
    logger.info(data, "this is namespace");
  });
  socket.on("/index/message", (data: any) => {
    logger.info(data, "this is regular socket");
  });
};
