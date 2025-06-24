import { Box, CssBaseline, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

/**
 * Layout Component
 *
 * Main application layout wrapper that provides:
 * - CSS baseline for consistent styling
 * - Fixed sidebar navigation
 * - Top header bar
 * - Main content area with routing outlet
 * - Responsive design with proper margins and scrolling
 */
function Layout() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* CSS baseline for consistent cross-browser styling */}
      <CssBaseline />

      {/* Fixed sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // Add margin to account for sidebar width
          ml: theme.drawerWidth,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top navigation bar */}
        <Topbar />

        {/* Main content with routing - p is the padding of the page */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* React Router outlet for page content */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
