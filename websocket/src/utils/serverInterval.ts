import ws from "ws";

export const getPingInterval = (wss: ws.Server) =>
  setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) ws.terminate();
      ws.isAlive = false;
      // logger.info("pong");
      ws.ping();
    });
  }, 30000);
