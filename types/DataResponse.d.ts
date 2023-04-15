interface DataResponse<T> {
  data: T | null,
  success: boolean,
  error: IApplicationError | null
}