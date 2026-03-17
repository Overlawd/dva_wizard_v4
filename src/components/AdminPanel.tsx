import { useState, useEffect } from 'react';
import { Trash2, Upload, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getQueries, deleteQuery, scrapeUrl } from '../services/mockApi';
import { QueryLog } from '../types';

export default function AdminPanel() {
  const [queries, setQueries] = useState<QueryLog[]>([]);
  const [scrapeUrlInput, setScrapeUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState('');

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    const data = await getQueries();
    setQueries(data);
  };

  const handleDelete = async (id: string) => {
    await deleteQuery(id);
    loadQueries();
  };

  const handleScrape = async () => {
    if (!scrapeUrlInput) return;
    setIsScraping(true);
    setScrapeMessage('');
    
    const result = await scrapeUrl(scrapeUrlInput);
    setScrapeMessage(result.message);
    setIsScraping(false);
    setScrapeUrlInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Web Scraper Tool */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Knowledge Base Ingestion
            </CardTitle>
            <CardDescription>
              Scrape external DVA resources to update the AI knowledge base.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://dva.gov.au/..."
                value={scrapeUrlInput}
                onChange={(e) => setScrapeUrlInput(e.target.value)}
                className="bg-white"
              />
              <Button 
                onClick={handleScrape} 
                disabled={isScraping}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScraping ? 'Scraping...' : 'Scrape'}
              </Button>
            </div>
            {scrapeMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-200">
                {scrapeMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">1,240</p>
                <p className="text-sm text-slate-500">Documents Indexed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">98.5%</p>
                <p className="text-sm text-slate-500">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">342</p>
                <p className="text-sm text-slate-500">Queries Today</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-sm text-slate-500">Flagged for Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Log */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Queries</CardTitle>
          <CardDescription>Monitor user interactions and moderate responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Query</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{q.user}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{q.query}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        q.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{q.timestamp.toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(q.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}