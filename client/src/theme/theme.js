 
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
      light: "#DBEAFE"
    },

    secondary: {
      main: "#0F766E"
    },

    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF"
    },

    text: {
      primary: "#172033",
      secondary: "#718096"
    },

    success: {
      main: "#16A34A"
    },

    warning: {
      main: "#D97706"
    },

    error: {
      main: "#DC2626"
    }
  },

  shape: {
    borderRadius: 12
  },

  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h5: {
      fontWeight: 800
    },

    button: {
      textTransform: "none",
      fontWeight: 650
    }
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E8EDF5",
          boxShadow:
            "0 2px 12px rgba(16, 24, 40, 0.035)"
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #EEF1F6"
        }
      }
    }
  }
});

export default theme;