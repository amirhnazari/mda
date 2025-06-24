import { styled } from "@mui/material/styles";
import { Box, Typography, List, Paper, Theme } from "@mui/material";

// Common container styles for messaging components
export const MessagingContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

// Common header styles for messaging components
export const MessagingHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(3),
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

// ChatBox specific styles
export const MessagesContainer = styled(Box)(() => ({
  flex: 1,
  padding: "16px",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));

export const MessageBubble = styled(Paper)<{ isFromCurrentUser: boolean }>(
  ({ theme, isFromCurrentUser }) => ({
    padding: theme.spacing(1.5, 2),
    maxWidth: "70%",
    alignSelf: isFromCurrentUser ? "flex-end" : "flex-start",
    backgroundColor: isFromCurrentUser
      ? theme.palette.primary.main
      : theme.palette.background.default,
    color: isFromCurrentUser
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    borderRadius: "18px",
    borderBottomRightRadius: isFromCurrentUser ? "4px" : "18px",
    borderBottomLeftRadius: isFromCurrentUser ? "18px" : "4px",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
  })
);

export const MessageTime = styled(Typography)(() => ({
  fontSize: "0.75rem",
  opacity: 0.7,
  marginTop: "4px",
  color: "inherit",
}));

export const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-end",
}));

export const SelectorContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
}));

// Inbox specific styles
export const MessagesList = styled(List)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  padding: theme.spacing(1),

  "& .MuiListItem-root": {
    borderRadius: "12px",
    marginBottom: theme.spacing(1),
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: `1px solid transparent`,
    padding: theme.spacing(2),

    "&:hover": {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.primary.light}`,
      transform: "translateY(-1px)",
      boxShadow: theme.shadows[2],
    },

    "&:last-child": {
      marginBottom: 0,
    },
  },
}));

export const UnreadIndicator = styled(Box)(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: theme.palette.info.main,
  flexShrink: 0,
  marginLeft: theme.spacing(1),
}));

export const MessageContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

// Helper function to get selected message background color
export const getSelectedMessageBackgroundColor = (theme: Theme): string => {
  return theme.palette.background.default;
};

// Utility functions
export const truncateMessage = (
  content: string,
  maxLength: number = 24
): string => {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + "...";
};

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
