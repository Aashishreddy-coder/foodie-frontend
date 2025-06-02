import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5722", // Deep Orange
      light: "#FF8A65",
      dark: "#E64A19",
    },
    secondary: {
      main: "#2E7D32", // Forest Green
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFF8E1",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
