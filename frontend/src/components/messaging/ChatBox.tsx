import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Chat } from "@models/index";
import { getAvatarByAlias } from "@utils/avatarMapping";
import {
  MessagingContainer,
  MessagingHeader,
  MessagesContainer,
  MessageBubble,
  MessageTime,
  InputContainer,
  SelectorContainer,
  formatMessageTime,
} from "@styles/messagingStyles";

// Type definitions
interface AvailableStaff {
  id: string;
  name: string;
  role: string;
  avatarAlias: string;
}

interface ChatBoxProps {
  availableStaff: AvailableStaff[];
  activeChat: Chat | null;
  onStaffSelect: (staffId: string) => void;
  onSendMessage: (content: string) => void;
  onBackToSelector: () => void;
  preSelectedStaff?: AvailableStaff | null;
}

/**
 * ChatBox Component
 *
 * Dual-purpose messaging interface that provides:
 * 1. Staff selection screen when no active chat
 * 2. Chat interface when a conversation is active
 *
 * Features:
 * - Autocomplete search for staff members
 * - Real-time message display
 * - Message input with send functionality
 * - Keyboard shortcuts (Enter to send)
 * - Pre-selection support for direct messaging
 */
const ChatBox: React.FC<ChatBoxProps> = ({
  availableStaff,
  activeChat,
  onStaffSelect,
  onSendMessage,
  onBackToSelector,
  preSelectedStaff,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<AvailableStaff | null>(
    preSelectedStaff || null
  );

  /**
   * Handle message sending
   * Validates message content and clears input after sending
   */
  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  /**
   * Handle keyboard shortcuts for message sending
   * Enter sends message, Shift+Enter creates new line
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Handle staff selection and initiate chat
   */
  const handleStaffSelection = () => {
    if (selectedStaff) {
      onStaffSelect(selectedStaff.id);
      setSelectedStaff(null);
    }
  };

  // Render staff selection interface when no active chat
  if (!activeChat) {
    return (
      <MessagingContainer>
        <MessagingHeader>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Message
          </Typography>
        </MessagingHeader>

        <SelectorContainer>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Select a colleague to start messaging
          </Typography>

          {/* Autocomplete staff selector with avatar display */}
          <Autocomplete
            fullWidth
            sx={{ maxWidth: 400 }}
            options={availableStaff}
            value={selectedStaff}
            onChange={(_, newValue) => setSelectedStaff(newValue)}
            getOptionLabel={(option) => `${option.role} ${option.name}`}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  src={getAvatarByAlias(option.avatarAlias)}
                  alt={option.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body2">
                  {option.role} {option.name}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a colleague"
                placeholder="Type to search..."
              />
            )}
          />

          {/* Start chat button */}
          <Button
            variant="contained"
            onClick={handleStaffSelection}
            disabled={!selectedStaff}
            sx={{ minWidth: 120 }}
          >
            Start Chat
          </Button>
        </SelectorContainer>
      </MessagingContainer>
    );
  }

  // Render active chat interface
  return (
    <MessagingContainer>
      {/* Chat header with back button */}
      <MessagingHeader>
        <IconButton
          onClick={onBackToSelector}
          sx={{
            color: "white",
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={getAvatarByAlias(activeChat.participantAvatarAlias)}
            alt={activeChat.participantName}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, color: "white" }}
            >
              {activeChat.participantRole} {activeChat.participantName}
            </Typography>
          </Box>
        </Box>
      </MessagingHeader>

      {/* Messages display area */}
      <MessagesContainer>
        {activeChat.messages.map((message) => (
          <MessageBubble
            key={message.id}
            isFromCurrentUser={message.isFromCurrentUser}
            elevation={1}
          >
            <Typography variant="body1" color="inherit">
              {message.content}
            </Typography>
            <MessageTime variant="caption">
              {formatMessageTime(message.timestamp)}
            </MessageTime>
          </MessageBubble>
        ))}

        {/* Empty state for new conversations */}
        {activeChat.messages.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              Start your conversation with {activeChat.participantRole}{" "}
              {activeChat.participantName}
            </Typography>
          </Box>
        )}
      </MessagesContainer>

      {/* Message input area */}
      <InputContainer>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!messageInput.trim()}
          sx={{ minWidth: 64, height: 40 }}
        >
          <SendIcon />
        </Button>
      </InputContainer>
    </MessagingContainer>
  );
};

export default ChatBox;
