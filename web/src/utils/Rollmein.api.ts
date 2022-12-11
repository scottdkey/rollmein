import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { apiUrl } from "./constants";

export enum RestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD"
}

interface AppError {
  type: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error: AppError
}

export async function ApiRequest<T, Res>(route: string, method: RestMethods, body?: T, accessToken?: string) {
  let options: RequestInit = {
    method,
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
  }

  if (method !== RestMethods.GET && body) {
    const setupBody = body && JSON.stringify(body)
    options = {
      ...options,
      body: setupBody
    }

  }

  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  }

  return await (await fetch(`${apiUrl}${route}`, options)).json() as Res
}

export function Mutation<ReturnType, ErrorType, Params>(options: UseMutationOptions<ReturnType, ErrorType, Params>, route: string, method: RestMethods) {
  return useMutation({
    mutationFn: (body) => ApiRequest<Params, ReturnType>(route, method, body
    ),
    ...options
  })
}