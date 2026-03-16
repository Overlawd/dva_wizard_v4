import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Send, ScrollText, User, Bot, CheckCircle, AlertCircle } from 'lucide-react';
import { ChatMessage, Source } from '../types';
import { mockSources, initialMessages } from '../utils/mockData';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      // Determine if statement or question (mock logic)
      const isStatement = !input.includes('?');
      
      if (isStatement) {
        const statementResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've noted that "${input}". I'll keep this in mind to provide personalized advice. How can I help you with your claim today?`,
          timestamp: new Date(),
          isStatement: true
        };
        setMessages(prev => [...prev, statementResponse]);
        setIsLoading(false);
        return;
      }

      // Mock Question Response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your query regarding "${input}", here is the relevant information:\n\nUnder the MRCA (Military Rehabilitation and Compensation Act 2004), which is the primary Act for new claims, you may be eligible for compensation if the condition can be related to your service. The standard of proof differs depending on whether your service was warlike or non-warlike.\n\nI recommend reviewing the specific Statement of Principles for your condition to determine the causal factors required.`,
        timestamp: new Date(),
        sources: mockSources
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'L1': return 'bg-red-100 text-red-800 border-red-200';
      case 'L2': return 'bg-green-100 text-green-800 border-green-200';
      case 'L3': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <ScrollText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">DVA Wizard</h1>
            <p className="text-xs text-slate-500">MRCA Primacy Active • 5,420 Sources Indexed</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className={msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}>
                <AvatarFallback>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="space-y-2 w-full">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sources</p>
                    {msg.sources.map((source) => (
                      <Card key={source.id} className="border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getLevelColor(source.level)}`}>
                                {source.level}
                              </span>
                              <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{source.title}</h4>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              {source.level === 'L1' || source.level === 'L2' ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                              )}
                              {source.trustScore}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-2">{source.snippet}</p>
                          <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate block">
                            {source.url}
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <Avatar className="bg-slate-700">
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about MRCA, DRCA, claims, or mental health support..."
            className="flex-1 bg-slate-50 border-slate-300 focus-visible:ring-blue-500"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-slate-400">AI can make mistakes. Verify important information with official DVA sources.</p>
        </div>
      </div>
    </div>
  );
}