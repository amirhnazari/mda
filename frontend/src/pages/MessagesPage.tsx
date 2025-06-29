import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Inbox from "@components/messaging/Inbox";
import ChatBox from "@components/messaging/ChatBox";
import { MessageService } from "@services/MessageService";
import { Message, Chat } from "@models/index";

interface AvailableStaff {
  id: string;
  name: string;
  role: string;
  avatarAlias: string;
}

const Messages: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [preSelectedStaff, setPreSelectedStaff] =
    useState<AvailableStaff | null>(null);
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Load initial data
    setMessages(MessageService.getMessages());
    setAvailableStaff(MessageService.getAvailableStaff());
  }, []);

  useEffect(() => {
    // Handle pre-selected staff or message from navigation state
    const state = location.state as {
      preSelectedStaff?: AvailableStaff;
      message?: Message;
    };
    if (state?.preSelectedStaff) {
      setPreSelectedStaff(state.preSelectedStaff);
      // Auto-start chat with pre-selected staff
      const chat = MessageService.createOrGetChat(state.preSelectedStaff.id);
      setActiveChat(chat);
    } else if (state?.message) {
      // Store the message to handle once availableStaff is loaded
      setPendingMessage(state.message);
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleMessageClick = useCallback(
    (message: Message) => {
      // Mark message as read
      MessageService.markAsRead(message.id);
      setMessages(MessageService.getMessages());

      // Create or get chat with the sender
      const senderStaff = availableStaff.find(
        (staff) => staff.name === message.sender
      );
      if (senderStaff) {
        const chat = MessageService.createOrGetChat(senderStaff.id);

        // Add the original message to the chat if it's not already there
        const messageExists = chat.messages.some(
          (msg) =>
            msg.content === message.content &&
            Math.abs(
              new Date(msg.timestamp).getTime() -
                new Date(message.timestamp).getTime()
            ) < 1000
        );

        if (!messageExists) {
          const chatMessage = {
            id: `chat-${message.id}`,
            senderId: senderStaff.id,
            receiverId: "current-user",
            content: message.content,
            timestamp: message.timestamp,
            isFromCurrentUser: false,
          };
          chat.messages.push(chatMessage);
          chat.lastMessage = chatMessage;
        }

        setActiveChat(chat);
      }
    },
    [availableStaff]
  );

  // Handle pending message once availableStaff is loaded
  useEffect(() => {
    if (pendingMessage && availableStaff.length > 0) {
      handleMessageClick(pendingMessage);
      setPendingMessage(null);
    }
  }, [pendingMessage, availableStaff, handleMessageClick]);

  const handleDeleteMessage = (messageId: string) => {
    // Delete message and associated chat from service
    MessageService.deleteMessage(messageId);
    // If the deleted chat was active, close it immediately
    if (activeChat) {
      const messageToDeleteObj = messages.find((msg) => msg.id === messageId);
      if (
        messageToDeleteObj &&
        activeChat.participantName === messageToDeleteObj.sender
      ) {
        setActiveChat(null);
      }
    }
    // Refresh the messages list
    setMessages(MessageService.getMessages());
  };

  const handleStaffSelect = (staffId: string) => {
    const chat = MessageService.createOrGetChat(staffId);
    setActiveChat(chat);
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      MessageService.sendMessage(activeChat.participantId, content);
      // Refresh the active chat to show new message
      setActiveChat(MessageService.getChat(activeChat.participantId) || null);
      // Refresh the inbox to show updated message order
      setMessages(MessageService.getMessages());
    }
  };

  const handleBackToSelector = () => {
    setActiveChat(null);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        p: 6,
      }}
    >
      <Box sx={{ display: "flex", gap: 3, height: "100%", width: "100%" }}>
        {/* Left side - Inbox (50%) */}
        <Box sx={{ flexBasis: "50%", height: "100%", minWidth: 0 }}>
          <Inbox
            messages={messages}
            onMessageClick={handleMessageClick}
            onDeleteMessage={handleDeleteMessage}
            activeChat={activeChat}
          />
        </Box>

        {/* Right side - Chat (50%) */}
        <Box sx={{ flexBasis: "50%", height: "100%", minWidth: 0 }}>
          <ChatBox
            availableStaff={availableStaff}
            activeChat={activeChat}
            onStaffSelect={handleStaffSelect}
            onSendMessage={handleSendMessage}
            onBackToSelector={handleBackToSelector}
            preSelectedStaff={preSelectedStaff}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
