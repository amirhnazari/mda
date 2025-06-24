// src/theme/theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    drawerWidth: string;
  }
  interface ThemeOptions {
    drawerWidth?: string;
  }
  interface Palette {
    custom: {
      sidebar: string;
      darkTitle: string;
      lightTitle: string;
      iconPrimary: string;
      iconSecondary: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      sidebar: string;
      darkTitle: string;
      lightTitle: string;
      iconPrimary: string;
      iconSecondary: string;
    };
  }
}
