interface themeObject {
  primary: string,
  secondary: string,
  accent: string,
  trim: string,
}

interface colorObject {
  allience: themeObject,
  horde: themeObject,
  darkTheme: themeObject,
  lightTheme: themeObject
}

const colors: colorObject = {
  allience: {
    primary: "",
    secondary: "",
    accent: "",
    trim: "",
  },
  horde: {
    primary: "",
    secondary: "",
    accent: "",
    trim: "",
  },
  darkTheme: {
    primary: "",
    secondary: "",
    accent: "",
    trim: "",
  },
  lightTheme: {
    primary: "",
    secondary: "",
    accent: "",
    trim: "",
  },
};

export const colorScheme = (theme: string) => {
  return colors[theme as keyof colorObject];
};
