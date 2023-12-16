import { ServerConfig } from "./Server.config.js";


export interface IGoogleOauth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}


export function GoogleOauth2Config() {
  const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

  const config: IGoogleOauth2Config = {
    clientId: GOOGLE_ID as string,
    clientSecret: GOOGLE_SECRET as string,
    redirectUri: `${ServerConfig().cors_uri}/api/auth/callback/google`,
  };
  return config;
}
