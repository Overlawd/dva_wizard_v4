import { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { VeteranDashboard } from './components/VeteranDashboard';
import { AdvocateDashboard } from './components/AdvocateDashboard';
import { User } from './types/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Route based on role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'veteran':
      return <VeteranDashboard user={user} />;
    case 'advocate':
      return <AdvocateDashboard user={user} />;
    default:
      return <Login onLogin={handleLogin} />;
  }
}

export default App;