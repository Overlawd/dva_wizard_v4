import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.1');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark Mode from system preference or localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('dva-dark-mode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dva-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`h-14 border-b flex items-center px-4 gap-4 ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">DVA Wizard</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface 
            selectedModel={selectedModel} 
            isDarkMode={isDarkMode}
          />
        </main>
      </div>
    </div>
  );
}

export default App;