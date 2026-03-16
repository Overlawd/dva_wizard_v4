import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { Questionnaire } from './Questionnaire';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, FileText, History } from 'lucide-react';
import { User as UserType } from '../types/auth';

export function VeteranDashboard({ user }: { user: UserType }) {
  const [view, setView] = useState<'chat' | 'questionnaire' | 'saved'>('chat');
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);

  return (
    <div className="flex h-full">
      {/* Veteran Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
          <p className="text-sm text-slate-500">Service No: {user.serviceNumber}</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Button
            variant={view === 'chat' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'chat' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => setView('chat')}
          >
            <User className="mr-2 h-4 w-4" />
            Ask a Question
          </Button>
          <Button
            variant={view === 'questionnaire' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'questionnaire' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => setView('questionnaire')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Entitlement Check
          </Button>
          <Button
            variant={view === 'saved' ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${view === 'saved' ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => setView('saved')}
          >
            <History className="mr-2 h-4 w-4" />
            Saved Q&A
          </Button>
        </nav>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 font-medium">Source Emphasis</p>
          <p className="text-xs text-blue-600 mt-1">DVA.gov.au, CLIK, Reddit</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
        {view === 'chat' && (
          <ChatInterface 
            role="veteran" 
            onAcceptResponse={(id) => console.log('Veteran accepted response', id, 'Trust=7')}
          />
        )}
        {view === 'questionnaire' && (
          <div className="max-w-2xl mx-auto">
            <Questionnaire onComplete={() => setQuestionnaireComplete(true)} />
          </div>
        )}
        {view === 'saved' && (
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Saved Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">No saved questions yet.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}