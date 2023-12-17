export interface IValidateAuthBody {
  token: string | undefined;
  authType: string;
}

export interface IValidateAuthRes {
  user: any;
  success: boolean;
  sessionId: string;
}
