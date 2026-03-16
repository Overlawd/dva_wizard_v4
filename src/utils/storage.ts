import { Message } from '../types';

const STORAGE_KEY = 'dva_wizard_chat_history';

export const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

export const loadChatHistory = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
  return [];
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};

export const exportChatToText = (messages: Message[]) => {
  let text = "DVA Wizard Chat History\n";
  text += "=========================\n\n";

  messages.forEach((msg) => {
    const time = new Date(msg.timestamp).toLocaleString();
    const role = msg.role === 'user' ? 'You' : 'DVA Wizard';
    text += `[${time}] ${role}:\n${msg.content}\n\n`;
    
    if (msg.sources && msg.sources.length > 0) {
      text += `Sources:\n`;
      msg.sources.forEach((src, i) => {
        text += `  ${i + 1}. ${src.title} (${src.type})\n`;
      });
      text += "\n";
    }
    text += "-------------------------\n\n";
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dva-wizard-chat-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};