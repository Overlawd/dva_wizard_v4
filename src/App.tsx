import { useState } from 'react';
import { Button } from './components/ui/button';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { ScrapingMenu } from './components/ScrapingMenu';
import { MessageSquare, LayoutDashboard, Settings, Globe } from 'lucide-react';

type View = 'chat' | 'dashboard' | 'scraping';

function App() {
  const [view, setView] = useState<View>('chat');

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            DVA Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-1">v4.0.0 • MRCA Primacy</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={view === 'chat' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'chat' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('chat')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat Assistant
          </Button>
          <Button
            variant={view === 'dashboard' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={view === 'scraping' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'scraping' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('scraping')}
          >
            <Globe className="mr-2 h-4 w-4" />
            Scraping Control
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'chat' && <ChatInterface />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'scraping' && <ScrapingMenu />}
      </main>
    </div>
  );
}

export default App;