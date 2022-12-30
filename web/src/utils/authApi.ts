import { RestMethods } from "../types/RestMethods.enum";
import { ApiRequest } from "./Rollmein.api";

export enum AuthRoutes {
  VALIDATE = `auth/validate`,
}


export const validateAuthRequest = async (body: IValidateAuthBody) => {
  return await ApiRequest<IValidateAuthBody, IValidateAuthRes>(AuthRoutes.VALIDATE, RestMethods.POST, { body })
}




