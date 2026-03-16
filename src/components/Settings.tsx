import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Save, Database, Cpu, Globe, CheckCircle2 } from 'lucide-react';

export function Settings() {
  const [model, setModel] = useState('llama3:8b');
  const [contextWindow, setContextWindow] = useState('8192');
  const [dbHost, setDbHost] = useState('localhost');
  const [scrapeDepth, setScrapeDepth] = useState('3');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">System Settings</h2>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          {saveStatus === 'saved' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : saveStatus === 'saving' ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Model Configuration */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              AI Model Configuration
            </CardTitle>
            <CardDescription>Configure the LLM routing and context parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Primary Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3:8b">Llama 3 (8B) - General Purpose</SelectItem>
                  <SelectItem value="qwen2.5:7b">Qwen 2.5 (7B) - Context Summarization</SelectItem>
                  <SelectItem value="codellama:7b">CodeLlama (7B) - SQL Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context Window (Tokens)</Label>
              <Input 
                id="context" 
                value={contextWindow}
                onChange={(e) => setContextWindow(e.target.value)}
                placeholder="8192"
              />
              <p className="text-xs text-slate-500">
                Max tokens for the LLM context window. Ensure this fits within your GPU VRAM.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Select defaultValue="0.3">
                <SelectTrigger id="temperature">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (Strict/Factual)</SelectItem>
                  <SelectItem value="0.3">0.3 (Balanced)</SelectItem>
                  <SelectItem value="0.7">0.7 (Creative)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Database & Scraping */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              Data & Indexing
            </CardTitle>
            <CardDescription>Database connection and scraping defaults.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dbhost">Database Host</Label>
              <Input 
                id="dbhost" 
                value={dbHost}
                onChange={(e) => setDbHost(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="embedding">Embedding Model</Label>
              <Select defaultValue="mxbai-embed-large">
                <SelectTrigger id="embedding">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mxbai-embed-large">mxbai-embed-large (1024-dim)</SelectItem>
                  <SelectItem value="nomic-embed-text">nomic-embed-text (768-dim)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDepth">Default Scrape Depth</Label>
              <Select value={scrapeDepth} onValueChange={setScrapeDepth}>
                <SelectTrigger id="defaultDepth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Seeds Only)</SelectItem>
                  <SelectItem value="3">Level 3 (Standard)</SelectItem>
                  <SelectItem value="5">Level 5 (Deep)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Source Authority Weights
          </CardTitle>
          <CardDescription>Adjust the re-ranking weights for retrieval.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Lexical (TF-IDF)</Label>
              <Input defaultValue="0.35" type="number" step="0.05" min="0" max="1" />
            </div>
            <div className="space-y-2">
              <Label>Semantic (Cosine)</Label>
              <Input defaultValue="0.65" type="number" step="0.05" min="0" max="1" />
            </div>
            <div className="space-y-2">
              <Label>MRCA Priority Boost</Label>
              <Input defaultValue="1.5" type="number" step="0.1" min="1" max="3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}