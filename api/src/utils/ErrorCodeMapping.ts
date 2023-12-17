import { IApplicationError } from "../types/ApplicationError";
import { ErrorTypes } from "../types/ErrorCodes.enum";
import { HTTPCodes } from "../types/HttpCodes.enum";

export function ErrorCodeMapping(error: IApplicationError): HTTPCodes {
  switch (error.type) {
    case ErrorTypes.APP_ERROR:
      return HTTPCodes.SERVER_ERROR;
    case ErrorTypes.DB_ERROR:
      return HTTPCodes.FAILED_DEPENDENCY;
    case ErrorTypes.REDIS_ERROR:
      return HTTPCodes.FAILED_DEPENDENCY;
    case ErrorTypes.INPUT_ERROR:
      return HTTPCodes.BAD_REQUEST;
    case ErrorTypes.AUTH_ERROR:
      return HTTPCodes.NOT_AUTHORIZED;
    default:
      return HTTPCodes.OK;
  }
}
