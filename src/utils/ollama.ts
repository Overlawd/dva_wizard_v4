import { Message, OllamaModel } from '../types';

const RAG_BACKEND_URL = 'http://localhost:3000';

export const chatWithOllama = async (
  messages: Message[],
  model: string = 'llama3.1',
  onChunk: (chunk: string) => void,
  onSources: (sources: any[]) => void,
  onComplete: () => void,
  onError: (error: string) => void
) => {
  try {
    const response = await fetch(`${RAG_BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || `Backend error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '');
          try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'sources') {
              onSources(parsed.sources);
            } else if (parsed.type === 'content') {
              onChunk(parsed.content);
            } else if (parsed.type === 'done') {
              onComplete();
            } else if (parsed.type === 'error') {
              onError(parsed.error);
            }
          } catch (e) {
            console.warn('Failed to parse SSE data', e);
          }
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    onError(errorMessage);
  }
};

// Keep existing non-streaming helpers for other endpoints
const OLLAMA_BASE_URL = 'http://localhost:11434';

export const listModels = async (): Promise<OllamaModel[]> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error(`Failed to fetch models: ${response.status}`);
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