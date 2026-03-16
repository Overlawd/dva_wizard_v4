import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Save } from 'lucide-react';

export function SettingsPanel() {
  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Configure your local LLM and RAG parameters</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Select the Ollama model running locally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select defaultValue="llama3.1">
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3.1">Llama 3.1 (8B)</SelectItem>
                  <SelectItem value="llama3.1:70b">Llama 3.1 (70B)</SelectItem>
                  <SelectItem value="qwen2.5">Qwen 2.5</SelectItem>
                  <SelectItem value="mistral">Mistral 7B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="embeddings">Embedding Model</Label>
              <Select defaultValue="nomic-embed-text">
                <SelectTrigger id="embeddings">
                  <SelectValue placeholder="Select embedding model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nomic-embed-text">Nomic Embed Text</SelectItem>
                  <SelectItem value="mxbai-embed-large">Mxbai Embed Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Generation Parameters</CardTitle>
            <CardDescription>Fine-tune response behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temp">Temperature: 0.7</Label>
              <Input id="temp" type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokens">Max Tokens</Label>
              <Input id="tokens" type="number" defaultValue="2048" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <CardDescription>Define the AI's behavior and role</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[120px] p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="You are a helpful assistant specializing in Australian Department of Veterans' Affairs (DVA) legislation. Provide accurate answers citing specific acts like MRCA, VEA, and SRCA."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}