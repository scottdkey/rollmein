import { RedisKeys } from "./redisKeys.enum"


export function RedisError<T>(key: RedisKeys, id: string, data: T, message: string) {
  return `${message} ${{ key: `${key}-${id}`, data }}`
}


export enum ErrorMessages {
  CreateGroup = "createGroup Error",
  GroupNotFound = "group not found",
  GroupsNotFound = "groups not found",
  NoRowsReturned = "no Rows returned",
  DatabaseError = 'postgres connection has had an error',
  UnknownProblemError = "unknown application error occurred",
  NullInputError = "null input received",
  LoginError = "login error",
  AuthorizationError = "not authorized to complete this action",
  NotInDatabaseError = "unable to find record in database",
  InvalidRollError = "invalid roll",
  InvalidRollType = "invalid roll type",
  InvalidRollValue = "invalid roll value",
  InvalidRollCount = "invalid roll count",
  UnableToWriteToDatabase = "unable to write to database",
  MustHaveTank = 'must have a tank',
  MustHaveCorrectDps = 'must have 3 dps',
  MustHaveHealer = 'must have a healer',
  MustCorrectPlayers = 'must have 5 or more players',
}




