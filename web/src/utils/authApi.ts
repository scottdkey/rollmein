import { RestMethods } from "../types/RestMethods.enum";
import { ApiRequest } from "./Rollmein.api";

export enum AuthRoutes {
  VALIDATE = `auth/validate`,
}


export const validateAuthRequest = async (body: IValidateAuthBody) => {
  const res = await ApiRequest<IValidateAuthRes, IValidateAuthBody>(AuthRoutes.VALIDATE, RestMethods.POST, { body })
  if (res.ok) {
    return res.json() as unknown as IValidateAuthRes
  }
  return null
}




