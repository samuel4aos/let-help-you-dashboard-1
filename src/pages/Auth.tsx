import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '../store/useHotelStore';
import { Hotel, Mail, Lock, ArrowRight, Github, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { setUser } = useHotelStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    // Mock Login/Signup
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? email.split('@')[0] : name,
      email: email,
      role: (email.includes('admin') ? 'admin' : 'guest') as any,
    };

    setUser(mockUser);
    toast.success(`${isLogin ? 'Welcome back' : 'Account created'}, ${mockUser.name}!`);
    
    if (mockUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-slate-900 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16" />
            <div className="bg-amber-500 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <Hotel className="text-slate-900 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight">The Grand Regency</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Victoria Island's Premier Residence</p>
          </div>
          
          <CardHeader className="pt-10 text-center">
            <CardTitle className="text-3xl font-serif">{isLogin ? 'Welcome Back' : 'Join Regency'}</CardTitle>
            <CardDescription className="text-slate-500 text-base mt-2 font-medium">
              {isLogin ? 'Enter your credentials to access your world.' : 'Sign up to unlock exclusive benefits and personalized stays.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
                      placeholder="Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all" 
                    placeholder="Email Address" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all" 
                    placeholder="Password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-sm text-amber-600 font-bold hover:underline">Forgot Password?</button>
                </div>
              )}

              <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold group shadow-lg shadow-slate-900/10 text-lg">
                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold"><span className="bg-white px-4 text-slate-400">Authentication Port</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold">
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold">
                  <Github className="mr-3 h-5 w-5" /> Github
                </Button>
              </div>
            </form>
            
            <div className="mt-10 text-center text-sm">
              <span className="text-slate-500 font-medium">{isLogin ? "New to Regency?" : "Already a member?"}</span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-amber-600 font-bold hover:underline underline-offset-4"
              >
                {isLogin ? 'Begin Your Journey' : 'Sign In To Account'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;