import { useState } from 'react';
import { Send, Check, X, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { sendMessage } from '../services/mockApi';
import { Message } from '../types';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessage(userMessage.content);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurate = (msgId: string, type: 'accepted' | 'denied') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, curated: type } : msg))
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <FileText className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Ask a question about DVA benefits</p>
            <p className="text-sm">Try asking about hearing loss claims or payment rates.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              <Card className={`${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white border-blue-700' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.role === 'assistant' && msg.sources && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sources</p>
                      <div className="space-y-2">
                        {msg.sources.map((source) => (
                          <div key={source.id} className="bg-slate-50 p-3 rounded-md border border-slate-100">
                            <p className="text-sm font-medium text-slate-900">{source.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{source.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.trustLevel && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Trust Level:</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {msg.trustLevel}%
                        </span>
                      </div>
                      
                      {!msg.curated && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Curate:</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleCurate(msg.id, 'accepted')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                            onClick={() => handleCurate(msg.id, 'denied')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {msg.curated === 'accepted' && (
                        <span className="text-xs text-emerald-600 font-medium">✓ Accepted</span>
                      )}
                      {msg.curated === 'denied' && (
                        <span className="text-xs text-red-600 font-medium">✕ Denied</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-white border-slate-200 shadow-sm w-24">
              <CardContent className="p-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-slate-200 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <Input
            placeholder="Ask about DVA benefits, claims, or services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}