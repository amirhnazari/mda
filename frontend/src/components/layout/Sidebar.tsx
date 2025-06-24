import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MessageIcon from "@mui/icons-material/Message";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

/**
 * Commented out: closedMixin for collapsible sidebar functionality
 * This would be used if the sidebar had expand/collapse functionality
 */

/**
 * Styled sidebar container component
 * Currently not used but kept for potential future styling needs
 */
const Sidebar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/**
 * Styled drawer component with custom styling
 * Creates a permanent sidebar with fixed width and custom background
 */
const Drawer = styled(MuiDrawer)(({ theme }) => ({
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: theme.drawerWidth,
    backgroundColor: theme.palette.custom.sidebar,
  },
}));

/**
 * DrawerComponent (Sidebar Navigation)
 *
 * Provides navigation between main application pages:
 * - Dashboard (home page)
 * - Patients (patient management)
 * - Messages (communication)
 *
 * Also includes a back button for browser history navigation
 */
export default function DrawerComponent() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" open={false} anchor="left">
      {/* Back navigation button */}
      <ListItemButton
        sx={{
          mt: 1,
          minHeight: 48,
          justifyContent: "center",
          px: 2.5,
          color: theme.palette.custom.iconSecondary,
        }}
        onClick={() => navigate(-1)} // Go back in history
      >
        <ArrowBackIosNewIcon />
      </ListItemButton>

      {/* Main navigation menu */}
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {/* Dynamic menu items with icons and routes */}
        {["Dashboard", "Patients", "Messages"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5,
              }}
              onClick={() => {
                // Route navigation based on menu item index
                if (index === 0) {
                  navigate("/");
                } else if (index === 1) {
                  navigate("/patients");
                } else if (index === 2) {
                  navigate("/messages");
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: "auto",
                  justifyContent: "center",
                  color: theme.palette.custom.iconSecondary,
                }}
              >
                {/* Icon selection based on menu item */}
                {(() => {
                  if (index === 0) {
                    return <SpaceDashboardIcon />;
                  } else if (index === 1) {
                    return <PersonSearchIcon />;
                  } else if (index === 2) {
                    return <MessageIcon />;
                  }
                })()}
              </ListItemIcon>
              {/* Text is hidden (opacity 0) for icon-only sidebar design */}
              <ListItemText primary={text} sx={{ opacity: 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export { Sidebar };
