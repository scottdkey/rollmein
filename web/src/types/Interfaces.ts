export type roleType = { [key: string]: boolean };

export interface BlankPlayerObject {
  name: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in: boolean;
}

export interface PlayerObject extends BlankPlayerObject {
  id: number;
}

export interface PlayerFormObject {
  name: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in: boolean;
}
export interface DPSObject {
  newDPS: Array<PlayerObject>;
  players: Array<PlayerObject>;
}
export interface PlayerFormModalInterface {
  visible: boolean;
  player: PlayerObject | null;
  close(): void;
}

export interface UserObject {
  id: number,
  email: string,
  username: string,
  password: string,
}
export interface AuthObject {
  email: string;
  password: string;
}
export type PlayerContextType = {
  players: Array<PlayerObject> | undefined;
  setPlayers: (value: Array<PlayerObject>) => void;
  inGroup: Array<PlayerObject> | undefined;
  setInGroup: (value: Array<PlayerObject>) => void;
  removePlayer: (value: number) => void;
  updatePlayer: (value: PlayerObject) => void;
  addPlayer: (value: PlayerFormObject) => void;
  inGroupCount: number;
  showPlayers: boolean;
  toggleShowPlayers(): void;
  blankPlayer: BlankPlayerObject
};


export interface ThemeObject {
  [key: string]: string;
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  textAccent: string;
  backgroundColor: string;
  headerBackgroundColor: string;
  blockquoteColor: string;
}

export interface ThemeContextInterface {
  themeName: string;
  setThemeName: (value: string) => void;
  theme: ThemeObject;
}

export interface ThemesInterface {
  [key: string]: any;
  dark: ThemeObject;
  light: ThemeObject;
  horde: ThemeObject;
  allience: ThemeObject;
}

export interface PlayerCardInterface {
  player?: PlayerObject;
}

export type RoleLogoImage = {
  active: boolean;
  source: string;
  type: string;
}