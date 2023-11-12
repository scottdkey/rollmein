import { IApplicationError } from "../../../web/src/types/ApplicationError";



export function createError({type, message, context, stacktrace, detail}: IApplicationError): IApplicationError {
  return {
    type,
    message,
    context,
    stacktrace,
    detail
  }
}