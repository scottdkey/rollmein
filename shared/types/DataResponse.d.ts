import { ApplicationError } from './ApplicationError';

interface DataResponse<T> {
  data: T | null,
  success: boolean,
  error: ApplicationError | null
}