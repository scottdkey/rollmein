


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
const themes: ThemesInterface = {
  dark: {
    primary: "#081124",
    secondary: "#060a12",
    accent: "#0f3460",
    textColor: "#b3b6bd",
    textAccent: "#47494d",
    backgroundColor: "#3f4759",
    headerBackgroundColor: "#081124",
    white: "#e3e3e3",
    red: "#b51f1f",
    black: "#0f1624",
    buttonColor: "#692f0c",
    buttonHover: "#461075"
  },
  light: {
    primary: "#1ca086",
    secondary: "rgba(0,0,0,0.08)",
    accent: "rgba(0,0,0,0.08)",
    textColor: "black",
    textAccent: "black",
    backgroundColor: "white",
    headerBackgroundColor: "#f6f6f6",
    white: "#e3e3e3",
    red: "#b51f1f",
    black: "#01040a",
    buttonColor: "#461075",
    buttonHover: "#692f0c"
  },
  horde: {
    primary: "#781414",
    secondary: "#a2c6c9",
    accent: "#a2c6c9",
    textColor: "#303030",
    textAccent: "#303030",
    backgroundColor: "maroon",
    headerBackgroundColor: "#f6f6f6",
    white: "#e3e3e3",
    red: "#b51f1f",
    black: "#01040a",
    buttonColor: "#461075",
    buttonHover: "#692f0c"
  },
  allience: {
    primary: "#1c3661",
    accent: "#1c3661",
    secondary: "#a2c6c9",
    textColor: "#303030",
    textAccent: "#303030",
    backgroundColor: "maroon",
    headerBackgroundColor: "#f6f6f6",
    white: "#e3e3e3",
    red: "#b51f1f",
    black: "#01040a",
    buttonColor: "#461075",
    buttonHover: "#692f0c"
  },
};

const setCSSVariables = (theme: ThemeObject): void => {
  for (const value in theme) {
    document.documentElement.style.setProperty(`--${value}`, theme[value]);
  }
};


const ProvisionTheme = (setTheme: Function, currentTheme: ThemeObject) => {
  setTheme(currentTheme);
  setCSSVariables(currentTheme);
};

export { themes, ProvisionTheme }