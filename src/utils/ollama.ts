import { Message, OllamaModel } from '../types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export const chatWithOllama = async (
  messages: Message[],
  model: string = 'llama3.1'
): Promise<{ content: string; model: string }> => {
  // Add system prompt for DVA context
  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: 'You are DVA Wizard v3.0, an expert assistant for Australian Department of Veterans\' Affairs claims and legislation. You specialize in MRCA, DRCA, VEA, and related policies. Be concise, accurate, and empathetic. If you are unsure, state that clearly.',
    timestamp: new Date(),
  };

  const apiMessages = [
    { role: systemMessage.role, content: systemMessage.content },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        stream: false, // Using non-streaming for simplicity
        options: {
          temperature: 0.7,
          num_ctx: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.message.content,
      model: data.model,
    };
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw error;
  }
};

export const listModels = async (): Promise<OllamaModel[]> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
};

export const checkOllamaHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
};