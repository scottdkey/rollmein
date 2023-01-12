import { HTTPCodes } from "./HttpCodes.enum";

interface Error {
  status: HTTPCodes
  message: string
  stacktrace: any
}