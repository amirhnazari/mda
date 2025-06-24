export interface Message {
  id: string;
  sender: string;
  senderRole: string;
  senderAvatarAlias: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

export interface Chat {
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatarAlias: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
}
