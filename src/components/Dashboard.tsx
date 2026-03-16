import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockSystemStatus } from '../utils/mockData';
import { SystemStatus } from '../types';
import { Activity, Database, Cpu, Globe } from 'lucide-react';

export function Dashboard() {
  const [status, setStatus] = useState<SystemStatus>(mockSystemStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        gpuLoad: Math.max(0, Math.min(100, prev.gpuLoad + (Math.random() * 10 - 5))),
        vramUsed: Math.max(2, Math.min(6, prev.vramUsed + (Math.random() * 0.2 - 0.1)))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getLoadColor = (load: number) => {
    if (load < 50) return 'text-green-500';
    if (load < 80) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">System Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">GPU Load</CardTitle>
            <Cpu className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getLoadColor(status.gpuLoad)}`}>
              {status.gpuLoad.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Model: {status.activeModel}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">VRAM Usage</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {status.vramUsed.toFixed(1)} / {status.vramTotal} GB
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${(status.vramUsed / status.vramTotal) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Database</CardTitle>
            <Database className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 capitalize">
              {status.dbStatus}
            </div>
            <p className="text-xs text-slate-500 mt-1">{status.totalIndexed.toLocaleString()} pages indexed</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Last Scrape</CardTitle>
            <Globe className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {status.lastScrape.toLocaleTimeString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">{status.lastScrape.toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">Retrieval Strategy</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Text-to-SQL (Acts, Standards)</li>
                <li>Semantic Search (pgvector)</li>
                <li>Lexical Re-ranking (TF-IDF)</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">Model Routing</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Llama3:8b (General)</li>
                <li>Qwen2.5:7b (Summary)</li>
                <li>CodeLlama:7b (SQL)</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">Authority Tiers</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>L1: Legislation (Binding)</li>
                <li>L2: CLIK (Policy)</li>
                <li>L3: DVA.gov.au (Info)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}