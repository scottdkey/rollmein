import { ConfigService } from '../common/config/config.service';
import { container } from '../container';

import * as jwt from "jsonwebtoken"

const secretKey = container.get(ConfigService).serverConfig.secretKey

export interface TokenInterface {
  id: string
}


export const signJwt = (userId: string): string => jwt.sign({ id: userId }, secretKey, { expiresIn: '7d', algorithm: "RS256" })

export const verifyNextAuthToken = (token: string) => jwt.verify(token, secretKey, { algorithms: ["RS256"] })
