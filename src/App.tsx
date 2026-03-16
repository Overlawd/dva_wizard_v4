import { useRef, useEffect } from 'react';
import { useOllama } from './hooks/useOllama';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Cpu } from 'lucide-react';

function App() {
  const { messages, isLoading, sendMessage } = useOllama('llama3.1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl">
        <CardHeader className="bg-white border-b border-slate-200 py-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Cpu className="h-5 w-5 text-emerald-600" />
            </div>
            Local Llama Chat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Cpu className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">Start a conversation with llama3.1</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </Card>
    </div>
  );
}

export default App;