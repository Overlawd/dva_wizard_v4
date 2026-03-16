import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'; // Assuming standard table structure or using divs
import { CheckCircle2, XCircle, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import { FlaggedResponse } from '../types/auth';

// Mock Data
const MOCK_FLAGGED: FlaggedResponse[] = [
  {
    id: '1',
    query: 'Can I get MRCA for hearing loss?',
    response: 'Yes, hearing loss is claimable under MRCA if it occurred during service...',
    flagReason: 'Incorrect legislation cited (VEA instead of MRCA)',
    timestamp: new Date(),
    status: 'pending'
  },
  {
    id: '2',
    query: 'What is the rate for TPI?',
    response: 'TPI is 100% of the general rate...',
    flagReason: 'Outdated payment rates',
    timestamp: new Date(Date.now() - 86400000),
    status: 'pending'
  }
];

export function CurationWorkflow() {
  const [flagged, setFlagged] = useState<FlaggedResponse[]>(MOCK_FLAGGED);

  const handleAction = (id: string, action: 'accept' | 'deny') => {
    setFlagged(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: action === 'accept' ? 'accepted' : 'denied' };
      }
      return item;
    }));
  };

  const pendingItems = flagged.filter(i => i.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Flagged Response Curation</h3>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>

      {pendingItems.length === 0 ? (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6 text-center text-emerald-800">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>All flagged responses have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium">Query</th>
                  <th className="p-4 font-medium">Flag Reason</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{item.query}</div>
                      <div className="text-slate-500 mt-1 line-clamp-2">{item.response}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {item.flagReason}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                          onClick={() => handleAction(item.id, 'accept')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:border-red-200"
                          onClick={() => handleAction(item.id, 'deny')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Accept sets Trust=2 (Curated)
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}