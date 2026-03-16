import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { Dashboard } from './Dashboard';
import { ScrapingMenu } from './ScrapingMenu';
import { CurationWorkflow } from './CurationWorkflow';
import { Settings } from './Settings';
import { Button } from './ui/button';
import { LayoutDashboard, Globe, Shield, Settings as SettingsIcon, List, Database } from 'lucide-react';
import { User as UserType } from '../types/auth';

type AdminView = 'overview' | 'chat' | 'scraping' | 'curation' | 'settings' | 'seeds';

export function AdminDashboard({ user }: { user: UserType }) {
  const [view, setView] = useState<AdminView>('overview');

  return (
    <div className="flex h-full">
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">v4.0 • Full Access</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={view === 'overview' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'overview' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('overview')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            System Status
          </Button>
          <Button
            variant={view === 'chat' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'chat' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('chat')}
          >
            <Database className="mr-2 h-4 w-4" />
            Test Query
          </Button>
          <Button
            variant={view === 'scraping' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'scraping' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('scraping')}
          >
            <Globe className="mr-2 h-4 w-4" />
            Scraping Control
          </Button>
          <Button
            variant={view === 'curation' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'curation' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('curation')}
          >
            <List className="mr-2 h-4 w-4" />
            Flagged Responses
          </Button>
          <Button
            variant={view === 'seeds' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'seeds' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('seeds')}
          >
            <Database className="mr-2 h-4 w-4" />
            Seed List
          </Button>
          <Button
            variant={view === 'settings' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`}
            onClick={() => setView('settings')}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        {view === 'overview' && <Dashboard />}
        {view === 'chat' && (
          <div className="h-full">
            <ChatInterface 
              role="admin"
              onAcceptResponse={(id) => console.log('Admin curated response', id, 'Trust=2')}
            />
          </div>
        )}
        {view === 'scraping' && <ScrapingMenu />}
        {view === 'curation' && (
          <div className="p-6">
            <CurationWorkflow />
          </div>
        )}
        {view === 'seeds' && (
          <div className="p-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold mb-4">Seed URL Management</h3>
              <p className="text-slate-500">View/Add/Remove seeds and promote trust levels.</p>
              {/* Placeholder for Seed List Table */}
              <div className="mt-4 border border-dashed border-slate-300 rounded-lg p-8 text-center">
                Seed list table would go here.
              </div>
            </div>
          </div>
        )}
        {view === 'settings' && <Settings />}
      </main>
    </div>
  );
}