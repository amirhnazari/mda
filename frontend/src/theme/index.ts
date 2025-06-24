import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  drawerWidth: `calc(${8 * 7}px + 1px)`,
  palette: {
    // background for pages or containers
    background: {
      default: "#E2DEF6", // light lavender
      paper: "#E9F0FF", // topbar/cards
    },
    // common UI elements
    primary: {
      main: "#4A4063", // sidebar + component title sections
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#746F6F", // subtitles
    },
    text: {
      primary: "#000000",
      secondary: "#746F6F",
    },
    custom: {
      sidebar: "#4A4063",
      darkTitle: "#4A4063",
      lightTitle: "#FFFFFF",
      iconPrimary: "#4A4063",
      iconSecondary: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h6: {
      color: "#000000",
    },
    h5: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    h4: {
      color: "#000000",
    },
    subtitle1: {
      color: "#746F6F",
      fontSize: "14px",
    },
    subtitle2: {
      color: "#746F6F",
      fontSize: "12px",
    },
    body1: {
      color: "#000000",
      fontWeight: "bold",
      fontSize: "16px",
    },
    body2: {
      color: "#000000",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          margin: 0,
          padding: 0,
          height: "100%",
          overflow: "hidden",
        },
        body: {
          margin: 0,
          padding: 0,
          height: "100%",
          overflow: "hidden",
        },
        "#root": {
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#E2DEF6",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          backgroundColor: "#4A4063",
          borderRadius: "10px",
          padding: "4px 8px",
        },
      },
    },
  },
});

export default theme;
