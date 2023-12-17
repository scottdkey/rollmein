import { ConfigService } from "../config/config.service.js";
import { container } from "../container.js";

import * as jwt from "jsonwebtoken";

const secretKey = container.get(ConfigService).serverConfig.secretKey;

export interface TokenInterface {
  id: string;
}

export const signJwt = (userId: string): string =>
  jwt.sign({ id: userId }, secretKey, { expiresIn: "7d", algorithm: "RS256" });

export const verifyNextAuthToken = (token: string) =>
  jwt.verify(token, secretKey, { algorithms: ["RS256"] });
