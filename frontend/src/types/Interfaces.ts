export type roleType = { [key: string]: boolean };

export interface newPlayerFormObject {
  playerName: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  inTheRoll: boolean;
}

export interface PlayerFormObject extends newPlayerFormObject {
  userId: string;
}

export interface PlayerObject extends PlayerFormObject {
  id: number;
}



export interface UserObject {
  id: string,
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
  onClick: Function
}