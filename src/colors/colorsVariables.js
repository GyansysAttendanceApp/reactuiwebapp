import { colors } from "./Color";

export const setCssVariables = () => {
  const root = document.documentElement;

  Object.keys(colors).forEach((key) => {
    const cssVariableName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVariableName, colors[key]);
  });
};
