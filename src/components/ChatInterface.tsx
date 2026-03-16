import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Message } from '../types';
import { chatWithOllama } from '../utils/ollama';
import { loadChatHistory, saveChatHistory, clearChatHistory } from '../utils/storage'; // FIXED: Added loadChatHistory
import SourceCard from './SourceCard';

interface ChatInterfaceProps {
  selectedModel: string;
  isDarkMode: boolean;
}

export default function ChatInterface({ selectedModel, isDarkMode }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) {
      setMessages(saved);
    }
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setError(null);
    setIsLoading(true);

    // Create a placeholder assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      model: selectedModel,
      sources: []
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      await chatWithOllama(
        [...messages, userMessage],
        selectedModel,
        // onChunk
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        },
        // onSources
        (sources) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, sources }
              : msg
          ));
        },
        // onComplete
        () => {
          setIsLoading(false);
        },
        // onError
        (err) => {
          setError(err);
          setIsLoading(false);
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, content: `Error: ${err}` }
              : msg
          ));
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      setIsLoading(false);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId 
          ? { ...msg, content: `I encountered an error: ${errorMessage}` }
          : msg
      ));
    }
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <div className="mb-4 p-4 bg-blue-500/10 rounded-full">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to DVA Wizard</h3>
            <p className="max-w-md">Ask questions about MRCA, VEA, SRCA, or claims processes. I'll search the legislation and provide cited answers.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <Card className={`p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-70 text-xs">
                  <span className="font-semibold uppercase">
                    {message.role === 'user' ? 'You' : message.model || 'DVA Wizard'}
                  </span>
                  <span>•</span>
                  <span>{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                    <p className="text-xs font-semibold mb-2 opacity-80">Sources:</p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <SourceCard key={idx} source={source} />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DVA Wizard is thinking...</span>
              </div>
            </Card>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <Card className="p-4 bg-red-50 border-red-200 text-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Connection Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask about DVA claims, MRCA, VEA..."
            disabled={isLoading}
            className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Powered by Ollama • {selectedModel}
          </p>
          {messages.length > 0 && (
            <button 
              onClick={handleClear}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Clear Chat History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}