export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface Message {
  _id: string;
  text: string;
  from: string;
  conversationId: string;
  createdAt: string;
  state: "sending" | "sent" | "delivered";
}

export interface Conversation {
  _id: string;
  members: [User];
  unread: number;
  lastSeen: {
    [key: string]: string;
  };
  messages: Message[];
}
