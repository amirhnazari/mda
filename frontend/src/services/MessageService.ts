import { Message, Chat, ChatMessage } from "@models/index";
import messagesMock from "@mocks/MessagesMock.json";
import staffMock from "@mocks/StaffOnDutyMock.json";

// Simulate current user ID
const CURRENT_USER_ID = "current-user";

class MessageServiceClass {
  private messages: Message[] = [...messagesMock];
  private chats: Chat[] = [];

  // Get all inbox messages with latest chat messages
  getMessages(): Message[] {
    // Group original messages by sender to show only the latest message per person
    const conversationMap = new Map<string, Message>();

    // Add original inbox messages, keeping only the latest per sender
    this.messages.forEach((msg) => {
      const existing = conversationMap.get(msg.sender);
      if (
        !existing ||
        new Date(msg.timestamp).getTime() >
          new Date(existing.timestamp).getTime()
      ) {
        conversationMap.set(msg.sender, msg);
      }
    });

    // Update with latest messages from active chats
    this.chats.forEach((chat) => {
      if (chat.lastMessage) {
        const existingMessage = conversationMap.get(chat.participantName);
        const isNewMessage =
          !existingMessage ||
          new Date(chat.lastMessage.timestamp).getTime() >
            new Date(existingMessage.timestamp).getTime();

        const inboxMessage: Message = {
          id: `inbox-${chat.participantId}-latest`,
          sender: chat.participantName,
          senderRole: chat.participantRole,
          senderAvatarAlias: chat.participantAvatarAlias,
          content: chat.lastMessage.content,
          timestamp: chat.lastMessage.timestamp,
          read: isNewMessage
            ? chat.lastMessage.isFromCurrentUser
            : existingMessage?.read ?? true,
        };
        conversationMap.set(chat.participantName, inboxMessage);
      }
    });

    // Convert back to array and sort by timestamp (newest first)
    return Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Get unread messages count
  getUnreadCount(): number {
    return this.getMessages().filter((msg) => !msg.read).length;
  }

  // Mark message as read
  markAsRead(messageId: string): void {
    const message = this.messages.find((msg) => msg.id === messageId);
    if (message) {
      message.read = true;
    }
  }

  // Get all chats
  getChats(): Chat[] {
    return this.chats;
  }

  // Get chat with specific participant
  getChat(participantId: string): Chat | undefined {
    return this.chats.find((chat) => chat.participantId === participantId);
  }

  // Create or get existing chat
  createOrGetChat(participantId: string): Chat {
    let chat = this.getChat(participantId);

    if (!chat) {
      const participant = staffMock.find((staff) => staff.id === participantId);
      if (!participant) {
        throw new Error("Participant not found");
      }

      // Check if there are existing inbox messages from this participant
      const existingInboxMessages = this.messages
        .filter((msg) => msg.sender === participant.name)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() // Sort chronologically (oldest first)
        );

      chat = {
        participantId,
        participantName: participant.name,
        participantRole: participant.role,
        participantAvatarAlias: participant.avatarAlias,
        messages: [],
      };

      // Add ALL existing inbox messages from this participant to the chat
      existingInboxMessages.forEach((inboxMessage) => {
        const chatMessage = {
          id: `chat-${inboxMessage.id}`,
          senderId: participantId,
          receiverId: "current-user",
          content: inboxMessage.content,
          timestamp: inboxMessage.timestamp,
          isFromCurrentUser: false,
        };
        chat!.messages.push(chatMessage);
      });

      // Set the last message to the most recent one
      if (chat.messages.length > 0) {
        chat.lastMessage = chat.messages[chat.messages.length - 1];
      }

      this.chats.push(chat);
    }

    return chat;
  }

  // Send message in chat
  sendMessage(participantId: string, content: string): ChatMessage {
    const chat = this.createOrGetChat(participantId);

    const newMessage: ChatMessage = {
      id: `chat-msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId: participantId,
      content,
      timestamp: new Date().toISOString(),
      isFromCurrentUser: true,
    };

    chat.messages.push(newMessage);
    chat.lastMessage = newMessage;

    return newMessage;
  }

  // Simulate receiving a message (for demo purposes)
  receiveMessage(participantId: string, content: string): ChatMessage {
    const chat = this.createOrGetChat(participantId);

    const newMessage: ChatMessage = {
      id: `chat-msg-${Date.now()}-received`,
      senderId: participantId,
      receiverId: CURRENT_USER_ID,
      content,
      timestamp: new Date().toISOString(),
      isFromCurrentUser: false,
    };

    chat.messages.push(newMessage);
    chat.lastMessage = newMessage;

    return newMessage;
  }

  // Get available staff for messaging
  getAvailableStaff() {
    return staffMock;
  }

  // Delete chat
  deleteChat(participantId: string): void {
    this.chats = this.chats.filter(
      (chat) => chat.participantId !== participantId
    );
  }

  // Delete message and its entire conversation (original + chat)
  deleteMessage(messageId: string): void {
    // 1. Try to locate an original inbox message with this id
    const originalMsg = this.messages.find((m) => m.id === messageId);

    // 2. Fallback: If the id corresponds to a generated inbox entry (e.g. "inbox-<id>-latest")
    //    or any other identifier, try to derive the participant via the chats array.
    let participantName: string | undefined = originalMsg?.sender;

    if (!participantName) {
      // Check if the id matches the generated inbox id pattern
      const chatMatch = this.chats.find(
        (c) => `inbox-${c.participantId}-latest` === messageId
      );
      if (chatMatch) {
        participantName = chatMatch.participantName;
      }
    }

    // No participant found → nothing to delete
    if (!participantName) return;

    // 3. Remove ALL original messages from that participant
    this.messages = this.messages.filter((m) => m.sender !== participantName);

    // 4. Remove the associated chat (if any)
    this.chats = this.chats.filter(
      (c) => c.participantName !== participantName
    );
  }
}

export const MessageService = new MessageServiceClass();
