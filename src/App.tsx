import { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import AdminPanel from './components/AdminPanel';
import { User } from './types';
import { logout } from './services/mockApi';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin'>('dashboard');

  useEffect(() => {
    // Check for persisted session (optional for demo)
    const storedUser = localStorage.getItem('dva_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('dva_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('dva_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1">
        {currentView === 'dashboard' ? <ChatInterface /> : <AdminPanel />}
      </main>
    </div>
  );
}

export default App;