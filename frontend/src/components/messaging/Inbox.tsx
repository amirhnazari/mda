import React, { useState } from "react";
import {
  Box,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Message, Chat } from "@models/index";
import { getAvatarByAlias } from "@utils/avatarMapping";
import {
  MessagingContainer,
  MessagingHeader,
  MessagesList,
  UnreadIndicator,
  MessageContent,
  truncateMessage,
  formatMessageTime,
  getSelectedMessageBackgroundColor,
} from "@styles/messagingStyles";
import DeleteConfirmationDialog from "@components/common/DeleteConfirmationDialog";

interface InboxProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  activeChat?: Chat | null;
}

/**
 * Inbox Component
 *
 * Displays a list of messages in the user's inbox with features:
 * - Chronological message sorting (newest first)
 * - Visual indicators for read/unread status
 * - Message preview with content truncation
 * - Delete functionality for individual messages
 * - Click to open/reply to messages
 * - Empty state handling
 */
const Inbox: React.FC<InboxProps> = ({
  messages,
  onMessageClick,
  onDeleteMessage,
  activeChat,
}) => {
  const theme = useTheme();
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const handleDeleteClick = (event: React.MouseEvent, messageId: string) => {
    event.stopPropagation();
    setMessageToDelete(messageId);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      onDeleteMessage(messageToDelete);
    }
    setMessageToDelete(null);
  };

  return (
    <MessagingContainer>
      {/* Inbox header */}
      <MessagingHeader>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Inbox
        </Typography>
      </MessagingHeader>

      {/* Messages list */}
      <MessagesList>
        {messages
          // Sort messages by timestamp (newest first)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .map((message) => (
            <ListItem
              key={message.id}
              onClick={() => onMessageClick(message)}
              sx={{
                backgroundColor:
                  activeChat && activeChat.participantName === message.sender
                    ? getSelectedMessageBackgroundColor(theme)
                    : "transparent",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
              secondaryAction={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    height: "100%",
                  }}
                >
                  {/* Unread indicator dot */}
                  {!message.read && <UnreadIndicator />}

                  {/* Message timestamp */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: message.read ? 400 : 600,
                      flexShrink: 0,
                    }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>

                  {/* Delete button */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(event) => handleDeleteClick(event, message.id)}
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              {/* Sender avatar with read/unread styling */}
              <ListItemAvatar>
                <Avatar
                  src={getAvatarByAlias(message.senderAvatarAlias)}
                  alt={message.sender}
                  sx={{
                    width: 52,
                    height: 52,
                    // Different border styling for read vs unread messages
                    border: message.read
                      ? "2px solid transparent"
                      : "2px solid",
                    borderColor: message.read ? "transparent" : "info.main",
                    boxShadow: message.read ? 1 : 2,
                  }}
                />
              </ListItemAvatar>

              {/* Message content */}
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      // Bold for unread, normal weight for read messages
                      fontWeight: message.read ? 500 : 700,
                      color: message.read ? "text.primary" : "primary.main",
                    }}
                  >
                    {message.sender}
                  </Typography>
                }
                secondary={
                  <MessageContent variant="body2">
                    {/* Truncate long message content for preview */}
                    {truncateMessage(message.content)}
                  </MessageContent>
                }
              />
            </ListItem>
          ))}

        {/* Empty state when no messages */}
        {messages.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No messages in your inbox
            </Typography>
          </Box>
        )}
      </MessagesList>
      <DeleteConfirmationDialog
        open={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName="message"
      />
    </MessagingContainer>
  );
};

export default Inbox;
