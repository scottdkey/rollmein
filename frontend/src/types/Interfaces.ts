export type roleType = { [key: string]: boolean };

export interface PlayerFormObject {
  player_name: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in_the_roll: boolean;
  user_id: string;
}

export interface PlayerObject extends PlayerFormObject {
  id: number;
  createdAt: string;
  updatedAt: string;
}
export interface DPSObject {
  newDPS: Array<PlayerObject>;
  players: Array<PlayerObject>;
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

export interface roleCountInterface {
  tanks: number;
  healers: number;
  dps: number;
  inGroupCount: number;
}


export interface ThemeObject {
  [key: string]: string;
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  textAccent: string;
  backgroundColor: string;
  headerBackgroundColor: string;
  white: string,
  red: string,
  black: string,
  buttonColor: string,
  buttonHover: string
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
export interface PlayerFormModalInterface {
  visible: boolean;
  player: PlayerObject | null;
  close(): void;
}

export interface RoleLogoImageInterface {
  active: boolean;
  source: string;
  type: string;
  updateBoolean: (type: string, active: boolean) => void
}