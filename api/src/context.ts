import { HTTPCodes } from "./types/HttpCodes.enum"
import { ApplicationErrorResponse, HttpCodeFromErrorType } from "./utils/errorsHelpers"


export function HandleDataResponse<T>(res: DataResponse<T>, successCode: HTTPCodes): { body: DataResponse<T>, status: HTTPCodes } {

  if (!res.success && res.error) {
    return {
      body: res,
      status: HttpCodeFromErrorType(res.error)
    }
  }
  if (res.success && res.data) {
    return {
      body: res,
      status: successCode
    }
  }
  if (res.success && !res.data) {
    return {
      body: res,
      status: successCode
    }
  }
  return {
    body: ApplicationErrorResponse(new Error('oops, something went wrong')),
    status: HTTPCodes.SERVER_ERROR
  }
}