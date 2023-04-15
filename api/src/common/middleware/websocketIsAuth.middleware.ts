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
  if (session.error) {
    logger.error({
      ...session.error,
      message: "unable to find session",

    })
  }
  return {
    user: session.data,
    valid: session.success
  }
}