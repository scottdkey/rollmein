import { container } from "../../container"
import { LoggerService } from "../../logger/logger.service"
import { SessionService } from "../../session/session.service"

export interface WebsocketState {
  user: User | null
  validUser: boolean
}

const sessionService = container.get(SessionService)
const logger = container.get(LoggerService).getLogger("websocketAuth")


export async function validateSessionToken(token: string) {
  const session = await sessionService.getSession(token)
  if (!session) {
    logger.error({
      message: "unable to find session",
    })
  }
  if (session) {
    return {
      user: session,
      valid: true
    }
  }
  return {
    user: null,
    valid: false
  }
}