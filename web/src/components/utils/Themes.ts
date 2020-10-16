import { ThemesInterface, ThemeObject } from "../../types/Interfaces"

const themes: ThemesInterface = {
  dark: {
    primary: "#1a1a2e",
    secondary: "#16213e",
    accent: "#0f3460",
    textColor: "white",
    textAccent: "orange",
    backgroundColor: "#e94560",
    headerBackgroundColor: "#16213e",
    blockquoteColor: "#aaa",
  },
  light: {
    primary: "#1ca086",
    secondary: "rgba(0,0,0,0.08)",
    accent: "rgba(0,0,0,0.08)",
    textColor: "black",
    textAccent: "black",
    backgroundColor: "white",
    headerBackgroundColor: "#f6f6f6",
    blockquoteColor: "rgba(0,0,0,0.80)",
  },
  horde: {
    primary: "#781414",
    secondary: "#a2c6c9",
    accent: "#a2c6c9",
    textColor: "#303030",
    textAccent: "#303030",
    backgroundColor: "maroon",
    headerBackgroundColor: "#f6f6f6",
    blockquoteColor: "rgba(0,0,0,0.80)",
  },
  allience: {
    primary: "#1c3661",
    accent: "#1c3661",
    secondary: "#a2c6c9",
    textColor: "#303030",
    textAccent: "#303030",
    backgroundColor: "maroon",
    headerBackgroundColor: "#f6f6f6",
    blockquoteColor: "rgba(0,0,0,0.80)",
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