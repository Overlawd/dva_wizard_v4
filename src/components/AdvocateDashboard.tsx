import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { Button } from './ui/button';
import { MessageSquare, Database, FileText, LogOut } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface AdvocateDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export function AdvocateDashboard({ user, onLogout }: AdvocateDashboardProps) {
  const [view, setView] = useState<'chat' | 'cases'>('chat');

  return (
    <div className="flex h-full">
      {/* Advocate Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Advocate Portal</h2>
          <p className="text-sm text-slate-500">{user.name}</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Button
            variant={view === 'chat' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'chat' ? 'bg-emerald-100 text-emerald-700' : ''}`}
            onClick={() => setView('chat')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Research Assistant
          </Button>
          <Button
            variant={view === 'cases' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'cases' ? 'bg-emerald-100 text-emerald-700' : ''}`}
            onClick={() => setView('cases')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Case Files
          </Button>
        </nav>
        
        <div className="space-y-2">
          <div className="text-xs text-slate-400">
            Access: Standard Corpus<br/>
            No Admin Tools
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'chat' && (
          <ChatInterface 
            role="advocate"
            onAcceptResponse={(id) => console.log('Advocate accepted response', id, 'Trust=6')}
          />
        )}
        {view === 'cases' && (
          <div className="p-6 text-center text-slate-500">
            Case file management placeholder.
          </div>
        )}
      </main>
    </div>
  );
}