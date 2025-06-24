import { SxProps, Theme } from "@mui/material/styles";

/**
 * Styles for comment done button
 * Returns appropriate styling based on the done state of a comment
 */
export const getDoneButtonStyles = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? "white" : "action.disabled",
  backgroundColor: isDone ? "success.main" : "transparent",
  borderRadius: "50%",
  padding: "4px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: isDone ? "success.dark" : "action.hover",
    transform: "scale(1.05)",
  },
});

/**
 * Styles for the done icon inside the button
 */
export const getDoneIconStyles = (isDone: boolean): SxProps<Theme> => ({
  fontSize: "1.2rem",
  fontWeight: isDone ? "bold" : "normal",
});
