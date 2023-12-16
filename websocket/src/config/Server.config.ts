export interface IServerConfig {
  [key: string]: any;
  dev: boolean;
  prod: boolean;
  test: boolean;
  cors_uri: string | undefined;
  port: number;
  secretKey: string;
  cookieName: string;
}

export function ServerConfig(): IServerConfig {
  const { SECRETKEY, PORT, CORS_URL } = process.env;
  return {
    dev: process.env.NODE_ENV === "development",
    prod: process.env.NODE_ENV === "production",
    test: process.env.NODE_ENV === "test",
    cors_uri: CORS_URL,
    port: parseInt(PORT as string),
    secretKey: SECRETKEY as string,
    cookieName: "qid",
  };
}
