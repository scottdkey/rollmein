export interface IServerConfig {
  [key: string]: any;
  dev: boolean;
  prod: boolean;
  test: boolean;
  cors_uri: string | undefined;
  port: number;
  cookieName: string;
  baseUrl: string | undefined;
  websocketKey: string | undefined;
}

export function ServerConfig(): IServerConfig {
  const { PORT, CORS_URL } = process.env;
  return {
    dev: process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",
    test: process.env.NODE_ENV === "test",
    cors_uri: CORS_URL,
    port: parseInt(PORT as string),
    cookieName: "qid",
    baseUrl: process.env.BASE_URL,
    websocketKey: process.env.WEBSOCKET_KEY,
  };
}
