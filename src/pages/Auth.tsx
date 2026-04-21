import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '../store/useHotelStore';
import { Hotel, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { hotelInfo, setUser } = useHotelStore();
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter the access password');
      return;
    }

    setLoading(true);
    
    // Simulate slight delay for effect
    setTimeout(() => {
      if (password === (hotelInfo.adminPassword || 'admin123')) {
        setUser({
          id: 'admin',
          name: 'Administrator',
          email: 'admin@regency.com',
          role: 'admin'
        });
        toast.success('Access Granted. Welcome back, Admin.');
        navigate('/admin');
      } else {
        toast.error('Invalid administrative password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-slate-900 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16" />
            <div className="bg-amber-500 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20 active:scale-95 transition-transform">
              <ShieldCheck className="text-slate-900 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Secure access for property management</p>
          </div>
          
          <CardHeader className="pt-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Hotel className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">The Grand Regency</span>
            </div>
            <CardTitle className="text-3xl font-serif">Access Verification</CardTitle>
            <CardDescription className="text-slate-500 text-base mt-2 font-medium">
              Enter your administrative password to continue to the dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all" 
                    placeholder="Administrative Password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
              
              <Button 
                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold group shadow-lg shadow-slate-900/10 text-lg"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Enter Dashboard'} {!loading && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Encrypted Session</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
            If you've lost your access credentials, please contact the system administrator.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;