import { UserObject, AuthObject, PlayerObject, PlayerFormObject, roleCountInterface } from "./Interfaces"

export type AuthReturn = {
  data: UserObject
  status: number;
};

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

export type ProtectedRouteType = {
  component: any;
  path: string;
};

export type RenderDPSType = {
  players: Array<PlayerObject>
  header: string
}

export type RenderSingleProps = {
  player: PlayerObject,
  header: string
}

export type SVGImage = {
  src: string;
  className: string;
  onClick(): any;
  fill?: string;
};
export type PlayerContextType = {
  players: Array<PlayerObject> | undefined;
  setPlayers: (value: Array<PlayerObject>) => void;
  inGroup: Array<PlayerObject> | undefined;
  setInGroup: (value: Array<PlayerObject>) => void;
  removePlayer: (value: number) => void;
  updatePlayer: (value: PlayerObject) => void;
  addPlayer: (value: PlayerFormObject) => PlayerObject;
  roleCounts: roleCountInterface
  showPlayers: boolean;
  toggleShowPlayers(): void;
  blankPlayer: PlayerFormObject
  valid: boolean
};
