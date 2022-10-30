import { HTTPCodes } from "./HttpCodes.enum"

export interface DataResponse<T> {
  data: T | null,
  success: boolean,
  error: AppError | null
}