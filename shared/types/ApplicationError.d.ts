import { ErrorMessages } from "../utils/ErrorTypes.enum";
import { ErrorTypes } from "./ErrorCodes.enum";

interface IApplicationError {
  context: string;
  type: ErrorTypes
  message: string;
  stacktrace?: any;
  detail?: any
}