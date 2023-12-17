import { ErrorMessages } from "../utils/ErrorTypes.enum";
import { ErrorTypes } from "./ErrorCodes.enum";
import { HTTPCodes } from "./HttpCodes.enum";

interface IApplicationError {
  context: string;
  type: ErrorTypes
  message: string;
  status: HTTPCodes
  stacktrace?: any;
  detail?: any
}