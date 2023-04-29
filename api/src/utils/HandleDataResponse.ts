import { DataResponse } from "../types/DataResponse"
import { ErrorTypes } from "../types/ErrorCodes.enum"
import { HTTPCodes } from "../types/HttpCodes.enum"
import { ErrorCodeMapping } from "./ErrorCodeMapping"


export function HandleDataResponse<T>(res: DataResponse<T>, successCode: HTTPCodes): { body: DataResponse<T>, status: HTTPCodes } {

  const body = {
    success: false,
    data: null,
    error: {
      type: ErrorTypes.APP_ERROR,
      message: "Something went wrong",
      context: "HandleDataResponse",
      stacktrace: null,
      detail: null
    }
  }
  const failReturn = {
    body,
    status: HTTPCodes.SERVER_ERROR
  }

  try {
    if (!res.success && res.error) {
      return {
        body: res,
        status: ErrorCodeMapping(res.error)
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
    return failReturn
  } catch (error) {
    return {
      body: {
        ...body, error: {
          ...body.error,
          detail: error.message,
        }
      },
      status: HTTPCodes.SERVER_ERROR
    }
  }
}