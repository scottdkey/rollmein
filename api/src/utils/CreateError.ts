import { IApplicationError } from "../types/ApplicationError";

export function createError({
  type,
  message,
  context,
  stacktrace,
  detail,
  status,
}: IApplicationError) {
  return {
    status,
    type,
    message,
    context,
    stacktrace,
    detail,
  };
}
