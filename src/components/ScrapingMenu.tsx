import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { RefreshCw, Globe, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScrapingTask } from '../types';

export function ScrapingMenu() {
  const [taskType, setTaskType] = useState<'full' | 'incremental' | 'url'>('incremental');
  const [targetUrl, setTargetUrl] = useState('');
  const [depth, setDepth] = useState('3');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const handleStartScrape = () => {
    setIsRunning(true);
    addLog(`Starting ${taskType} scrape...`);
    
    setTimeout(() => addLog(`Connecting to CLIK/DVA sources...`), 800);
    setTimeout(() => addLog(`Checking freshness (7-day skip window)...`), 1600);
    setTimeout(() => addLog(`Identified 142 new/updated pages.`), 2400);
    setTimeout(() => addLog(`Parsing content and extracting summaries...`), 3200);
    setTimeout(() => addLog(`Generating embeddings (mxbai-embed-large)...`), 4000);
    setTimeout(() => addLog(`Updating PostgreSQL database...`), 4800);
    setTimeout(() => {
      addLog(`Scrape complete. 142 pages indexed.`);
      setIsRunning(false);
    }, 5600);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Knowledge Base Management</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
          <AlertTriangle className="h-4 w-4" />
          Admin Access
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Scraping Configuration</CardTitle>
            <CardDescription>Configure the depth and scope of the indexing operation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Operation Type</Label>
              
              {/* Incremental Option */}
              <label 
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  taskType === 'incremental' ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="taskType" 
                    value="incremental"
                    checked={taskType === 'incremental'}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 text-blue-600 focus:ring-blue-600 checked:border-blue-600"
                  />
                  <CheckCircle2 className="absolute h-4 w-4 text-blue-600 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Incremental Update</div>
                  <div className="text-xs text-slate-500">Only scrape pages modified in last 7 days</div>
                </div>
              </label>

              {/* Full Re-index Option */}
              <label 
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  taskType === 'full' ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="taskType" 
                    value="full"
                    checked={taskType === 'full'}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 text-blue-600 focus:ring-blue-600 checked:border-blue-600"
                  />
                  <CheckCircle2 className="absolute h-4 w-4 text-blue-600 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Full Re-Index</div>
                  <div className="text-xs text-slate-500">Re-scrape all ~5,500 pages (Slow)</div>
                </div>
              </label>

              {/* Specific URL Option */}
              <label 
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  taskType === 'url' ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="taskType" 
                    value="url"
                    checked={taskType === 'url'}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 text-blue-600 focus:ring-blue-600 checked:border-blue-600"
                  />
                  <CheckCircle2 className="absolute h-4 w-4 text-blue-600 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Specific URL</div>
                  <div className="text-xs text-slate-500">Index a single page or document</div>
                </div>
              </label>
            </div>

            {taskType === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="url">Target URL</Label>
                <Input 
                  id="url" 
                  placeholder="https://clik.dva.gov.au/..." 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="depth">Crawl Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger id="depth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Seed pages only)</SelectItem>
                  <SelectItem value="3">Level 3 (Standard coverage)</SelectItem>
                  <SelectItem value="5">Level 5 (Deep crawl - High latency)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Higher depth increases coverage but significantly impacts performance.
              </p>
            </div>

            <Button 
              onClick={handleStartScrape} 
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Start Indexing
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Operation Log</CardTitle>
            <CardDescription>Real-time output from the scraping engine.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-slate-300 p-4 rounded-lg h-80 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <FileText className="h-8 w-8 mb-2 opacity-50" />
                  <p>Ready to start</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}