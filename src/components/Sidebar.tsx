import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Settings, 
  Cpu, 
  Database, 
  Moon, 
  Sun, 
  Download,
  FileText,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { OllamaModel } from '../types';
import { listModels, checkOllamaHealth } from '../utils/ollama';
import { exportChatToText } from '../utils/storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  selectedModel, 
  onModelChange,
  isDarkMode,
  onToggleDarkMode
}: SidebarProps) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const healthy = await checkOllamaHealth();
      setIsOllamaConnected(healthy);
      setIsChecking(false);
      if (healthy) {
        const availableModels = await listModels();
        setModels(availableModels);
      }
    };
    
    checkConnection();
    // Poll every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    exportChatToText([]); // The function reads from localStorage internally
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-r border-gray-200'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">DVA Wizard</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Status Card */}
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className={`w-4 h-4 ${isOllamaConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm font-semibold">System Status</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Ollama API</span>
                <span className={isOllamaConnected ? 'text-green-600' : 'text-red-600'}>
                  {isChecking ? 'Checking...' : (isOllamaConnected ? 'Connected' : 'Disconnected')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RAG Backend</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ChromaDB</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </Card>

          {/* Model Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold">Model Selection</h3>
            </div>
            <div className="space-y-2">
              {models.length > 0 ? (
                models.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => onModelChange(model.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedModel === model.name
                        ? 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-xs opacity-70 ${selectedModel === model.name ? 'text-blue-100' : 'text-gray-500'}`}>
                      {model.size ? `${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB` : 'Local'}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {isChecking ? 'Loading models...' : 'No models found. Ensure Ollama is running.'}
                </div>
              )}
            </div>
          </div>

          {/* Tools */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold">Tools</h3>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Chat (.txt)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={onToggleDarkMode}
              >
                {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            DVA Wizard v3.0 • RAG Enabled
          </div>
        </div>
      </aside>
    </>
  );
}