import { Message } from "../types/chat";

const STORAGE_KEY = "llama-chat-history";

export const loadChatHistory = (): Message[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return [];
  }
};

export const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
};