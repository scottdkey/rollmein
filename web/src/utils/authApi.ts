import { RestMethods } from "../types/RestMethods.enum";
import { IValidateAuthBody, IValidateAuthRes } from "../types/ValidateAuth";
import { ApiRequest } from "./Rollmein.api";

export enum AuthRoutes {
  VALIDATE = `auth/validate`,
}


export const validateAuthRequest = async (body: IValidateAuthBody) => {
  return await ApiRequest<IValidateAuthRes, IValidateAuthBody>(AuthRoutes.VALIDATE, RestMethods.POST, { body })
}




