import { User, LogOut, Home, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Header({ user, onLogout, currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">DVA Wizard</span>
            </div>
            
            <nav className="hidden md:flex gap-4">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onViewChange('dashboard')}
                className={currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'text-slate-600'}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              {user.role === 'admin' && (
                <Button
                  variant={currentView === 'admin' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('admin')}
                  className={currentView === 'admin' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'text-slate-600'}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Tools
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <Avatar className="bg-blue-100 border border-blue-200">
                <AvatarFallback className="text-blue-700 font-semibold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button variant="outline" size="icon" onClick={onLogout} className="border-slate-200">
              <LogOut className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}