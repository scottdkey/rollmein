import ws from "ws";
import http from "http";

export function WebsocketConfig():
  | ws.ServerOptions<typeof ws, typeof http.IncomingMessage>
  | undefined {
  const { WEBSOCKET_PORT } = process.env;
  return {
    port: WEBSOCKET_PORT ? parseInt(WEBSOCKET_PORT as string) : 8080,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3,
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024,
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024, // Size (in bytes) below which messages
      // should not be compressed if context takeover is disabled.
    },
  };
}
