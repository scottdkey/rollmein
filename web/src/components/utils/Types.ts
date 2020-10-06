import { UserObject, AuthObject } from "./Interfaces"

export type AuthReturn = {
  data: UserObject
  status: number;
};

type returnObjectWithError = {
  user: UserObject
  error?: boolean;
  errorMessage?: string
}

export type AuthContextType = {
  login: (value: AuthObject) => void;
  logout(): any;
  register: (value: AuthObject) => void;
  appleLogin: (value: Object) => void;
  googleLogin: (value: Object) => void;
  updateUser: (value: UserObject) => void;
  deleteUser: (value: Object) => void;
  user: UserObject | undefined;
  authenticated: boolean;
  error: string
};

export type NavItemType = {
  route: string;
  name: string;
};