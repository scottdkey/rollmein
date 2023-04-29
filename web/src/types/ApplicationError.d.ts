import { ErrorMessages } from "../utils/ErrorTypes.enum";
import { ErrorTypes } from "./ErrorCodes.enum";

export interface IApplicationError {
  context: string;
  type: ErrorTypes
  message: ErrorMessages;
  stacktrace?: any;
  detail?: any
}