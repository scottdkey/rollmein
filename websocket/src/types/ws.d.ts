type MessageHandler = (ws: ws.Server, ...args: any[]) => void;
type Listener = (
  req: http.IncomingMessage,
  socket: internal.Duplex,
  head: Buffer
) => void;
