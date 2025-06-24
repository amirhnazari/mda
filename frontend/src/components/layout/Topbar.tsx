import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { MessageService } from "@services/MessageService";
import { getAvatarByAlias } from "@utils/avatarMapping";
import { Message } from "@models/index";
import { ListItemAvatar, ListItemText } from "@mui/material";

/**
 * Topbar Component
 *
 * Application header that displays:
 * - User avatar with unread message count badge
 * - Dropdown menu for user settings
 * - Real-time update of unread message count
 */
function Topbar() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [unreadMessages, setUnreadMessages] = React.useState<Message[]>([]);

  /**
   * Setup unread message count tracking
   * Updates count on mount, periodically, and when window gains focus
   */
  React.useEffect(() => {
    const updateUnreadCount = () => {
      const messages = MessageService.getMessages();
      const unread = messages.filter((msg) => !msg.read);
      setUnreadCount(unread.length);
      setUnreadMessages(unread);
    };

    // Initial load
    updateUnreadCount();

    // Update every 5 seconds to catch new messages
    const interval = setInterval(updateUnreadCount, 5000);

    // Update when window comes into focus (user returns to tab)
    const handleFocus = () => updateUnreadCount();
    window.addEventListener("focus", handleFocus);

    // Cleanup listeners and intervals
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  /**
   * Handle user menu dropdown open
   */
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Handle user menu dropdown close
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationClick = (message: Message) => {
    handleCloseUserMenu();
    navigate("/messages", { state: { message } });
  };

  return (
    <AppBar position="relative">
      <Toolbar disableGutters sx={{ paddingX: { xs: 2, sm: 3 } }}>
        {/* Spacer to push user menu to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* User menu section */}
        <Box sx={{ flexGrow: 0 }}>
          {/* Badge showing unread message count */}
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0} // Hide badge when no unread messages
            sx={{
              "& .MuiBadge-badge": {
                right: 3,
                top: 3,
                fontSize: "0.75rem",
                minWidth: 18,
                height: 18,
              },
            }}
          >
            {/* User avatar button */}
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                src={getAvatarByAlias("user-avatar", false)}
              />
            </IconButton>
          </Badge>

          {/* Dropdown menu */}
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* Show unread messages or no messages text */}
            {unreadMessages.length > 0 ? (
              unreadMessages.map((message) => (
                <MenuItem
                  key={message.id}
                  onClick={() => handleNotificationClick(message)}
                  sx={{
                    borderBottom: "1px solid #eee",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={getAvatarByAlias(
                        message.senderAvatarAlias,
                        message.senderRole === "Patient"
                      )}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${message.sender} (${message.senderRole})`}
                    secondary={message.content}
                    secondaryTypographyProps={{
                      style: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "250px",
                      },
                    }}
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: "center" }}>
                  You have no new messages
                </Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Topbar;
