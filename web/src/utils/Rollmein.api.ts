import { apiUrl } from "./constants";
import { RestMethods } from "../types/RestMethods.enum";



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
    if (res.status <= 400) {
      return await res.json() as Res
    }
    return null
  } catch (e: any) {
    throw {
      message: e.message,
      status: e.status
    }
  }
}
