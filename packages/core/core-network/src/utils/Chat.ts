export interface ChatMessage {
  matchId: string;
  sender: string;
  message: string;
  timestamp: number;
}

export class ChatService {
  private chatHistory: Map<string, ChatMessage[]> = new Map<string, ChatMessage[]>();

  constructor() {}

  public addChatMessage(matchId: string, chatMessage: ChatMessage): void {
    if (!this.chatHistory.has(matchId)) {
      this.chatHistory.set(matchId, []);
    }

    const chatMessages = this.chatHistory.get(matchId)  ?? [];;
    chatMessages.push(chatMessage);

    if (chatMessages.length > 100) {
      chatMessages.shift();
    }

    this.chatHistory.set(matchId, chatMessages);
  }

  public getChatHistory(matchId: string): ChatMessage[] {
    return this.chatHistory.get(matchId) || [];
  }
}