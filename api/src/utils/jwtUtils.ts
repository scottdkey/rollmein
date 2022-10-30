import { ConfigService } from '../common/config.service';
import { container } from '../container';

import jwt from "jsonwebtoken"

const secretKey = container.get(ConfigService).ServerConfig().secretKey

export interface TokenInterface {
  id: string
}


export const signJwt = (userId: string): string => jwt.sign({ id: userId }, secretKey, { expiresIn: '7d', algorithm: "RS256" })

// export const verifyJwt = (token: string): DecodedIdToken => jwt.verify(token, secretKey, { algorithms: ["RS256"] })
