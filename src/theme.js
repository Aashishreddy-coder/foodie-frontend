// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f9a825', // Honey Gold
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9e9d24', // Olive Green
      light: '#cddc39',
      dark: '#827717',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fefae0', // Light Sand
      paper: '#ffffff',
    },
    text: {
      primary: '#263238', // Charcoal
      secondary: '#546e7a', // Cool Grey
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffa000',
    },
    success: {
      main: '#66bb6a',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 18px',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
