import { DataResponse } from '../types/DataResponse';
import { ErrorTypes } from '../types/ErrorCodes.enum';
import { HTTPCodes } from '../types/HttpCodes.enum';
import { RedisKeys } from '../services/redis.service';


export function HttpCodeFromErrorType(error: AppError): HTTPCodes {
  switch (error.type) {
    case ErrorTypes.APP_ERROR:
      return HTTPCodes.SERVER_ERROR
    case ErrorTypes.DB_ERROR:
      return HTTPCodes.FAILED_DEPENDENCY
    case ErrorTypes.REDIS_ERROR:
      return HTTPCodes.FAILED_DEPENDENCY
    case ErrorTypes.INPUT_ERROR:
      return HTTPCodes.BAD_REQUEST
    case ErrorTypes.AUTH_ERROR:
      return HTTPCodes.UNAUTHORIZED
    default:
      return HTTPCodes.OK
  }
}

const createError = (type: ErrorTypes, message: string): AppError => {
  console.error(type, message)
  return {
    type,
    message
  }
}

export function UnknownProblemError(error: Error): AppError {
  return createError(ErrorTypes.APP_ERROR, `unknown application error occurred error:${error}`)
}

export function ApplicationError(message: string): AppError {
  return createError(ErrorTypes.APP_ERROR, message)
}

export const DatabaseError = (message: string): AppError => createError(ErrorTypes.DB_ERROR, message)

export const NotInDatabaseError = (tableName: string, id: string): AppError => DatabaseError(`Table: ${tableName} not found. Nothing found matching id:${id}`)

export const NotInRedisError = (key: RedisKeys, id: string): AppError => createError(ErrorTypes.REDIS_ERROR, `Data with not found from key: ${key}-${id}`)

export function RedisError<T>(key: RedisKeys, id: string, data: T): AppError {
  return createError(ErrorTypes.REDIS_ERROR, `Error Storing to redis. ${{ key: `${key}-${id}`, data }}`)
}

export const NullInputError = createError(ErrorTypes.INPUT_ERROR, "null input received")

export const AuthorizationError = createError(ErrorTypes.AUTH_ERROR, "not authorized to complete this action")

export function ApplicationErrorResponse(error: Error): DataResponse<never> {
  return {
    data: null,
    success: false,
    error: ApplicationError(JSON.stringify(error))
  }
}

export const AuthorizationErrorResponse: DataResponse<never> = {
  data: null,
  success: false,
  error: AuthorizationError
}

export function UnknownProblemResponse(error: Error): DataResponse<never> {
  return {
    data: null,
    success: false,
    error: UnknownProblemError(error)
  }
}


