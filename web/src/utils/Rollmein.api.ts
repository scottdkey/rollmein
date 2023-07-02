import { RestMethods } from "../types/RestMethods.enum";
import { apiUrl } from "./constants";

export async function ApiRequest<Res, T>(route: string, method: RestMethods, params: { body?: T, sessionToken?: string }) {
  try {
    let options: RequestInit = {
      method,
      headers: {
        Authorization: "",
        'content-type': 'application/json'
      },
      credentials: 'include',
    }

    if (method !== RestMethods.GET && params.body) {
      const setupBody = params.body && JSON.stringify(params.body)

      options = {
        ...options,
        body: setupBody
      }

    }

    if (params.sessionToken) {
      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${params.sessionToken}`,
          'content-type': 'application/json'
        }
      }
    }
    const res = await fetch(`${apiUrl}${route}`, options)
    if (res.status === 401) {
      throw {
        message: 'Unauthorized',
        status: 401
      }
    }
    if (res.status < 400) {
      return await res.json() as Res
    }
    if (res.status >= 400) {
      throw {
        message: res.statusText,
        status: res.status
      }
    }
    return
  } catch (e: any) {
    throw {
      message: e.message,
      status: e.status
    }
  }
}
