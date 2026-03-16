import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, User, Briefcase } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: UserType['role']) => {
    // Mock authentication logic
    const mockUser: UserType = {
      id: '1',
      name: role === 'admin' ? 'System Admin' : role === 'veteran' ? 'John Veteran' : 'Jane Advocate',
      email: email || `${role}@dva.gov.au`,
      role: role,
      serviceNumber: role === 'veteran' ? '12345678' : undefined
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-600 p-3 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">DVA Wizard Portal</CardTitle>
          <CardDescription>Secure access to claims assistance and system management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="user@dva.gov.au" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-3 text-center">Quick Login (Demo Mode)</p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="w-full justify-start border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => handleLogin('admin')}
              >
                <Shield className="mr-2 h-4 w-4 text-red-600" />
                Login as Admin
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleLogin('veteran')}
              >
                <User className="mr-2 h-4 w-4 text-blue-600" />
                Login as Veteran
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                onClick={() => handleLogin('advocate')}
              >
                <Briefcase className="mr-2 h-4 w-4 text-emerald-600" />
                Login as Advocate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}