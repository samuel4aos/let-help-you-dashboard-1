import React, { useState, useEffect } from 'react';
import { useHotelStore } from './store/useHotelStore';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Hotel, Menu, X, Instagram, Facebook, Twitter, Mail, Phone, MapPin, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import Home from './pages/guest/Home';
import Rooms from './pages/guest/Rooms';
import MyBookings from './pages/guest/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import Auth from './pages/Auth';
import { Toaster, toast } from 'sonner';
import { Button } from './components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useHotelStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2.5 rounded-2xl group-hover:bg-amber-500 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
              <Hotel className="w-6 h-6 text-white group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tighter text-slate-900">REGENCY</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive('/') ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900 hover:scale-105'}`}>Home</Link>
            <Link to="/rooms" className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive('/rooms') ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900 hover:scale-105'}`}>Suites</Link>
            {user && (
                <Link to="/my-bookings" className={`text-sm font-bold uppercase tracking-widest transition-all ${isActive('/my-bookings') ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900 hover:scale-105'}`}>My Stays</Link>
            )}
            <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-all hover:scale-105">Admin</Link>
            
            <div className="flex items-center gap-6 pl-10 border-l border-slate-100">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="font-bold text-slate-900 text-sm h-12 px-6 rounded-2xl hover:bg-slate-50 transition-all">Login</Button>
                </Link>
              )}
              <Button onClick={() => navigate('/rooms')} className="bg-slate-900 text-white font-bold rounded-2xl px-8 h-12 shadow-lg shadow-slate-900/10 group">
                Book Now <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              size="icon-lg"
              onClick={() => setIsOpen(!isOpen)} 
              className="bg-slate-900 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-2xl"
            >
            <div className="px-6 pt-4 pb-10 space-y-4">
                <Link to="/" onClick={() => setIsOpen(false)} className="block py-4 text-xl font-serif text-slate-900 border-b border-slate-50">Home</Link>
                <Link to="/rooms" onClick={() => setIsOpen(false)} className="block py-4 text-xl font-serif text-slate-900 border-b border-slate-50">Suites</Link>
                {user && <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block py-4 text-xl font-serif text-slate-900 border-b border-slate-50">My Stays</Link>}
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-4 text-sm font-bold uppercase tracking-widest text-slate-400">Admin Access</Link>
                <div className="pt-6 flex flex-col gap-4">
                {!user ? (
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full h-14 rounded-2xl font-bold">Login</Button>
                    </Link>
                ) : (
                    <Button onClick={handleLogout} variant="outline" className="w-full h-14 rounded-2xl font-bold text-red-500 border-red-100">Logout</Button>
                )}
                <Button onClick={() => { navigate('/rooms'); setIsOpen(false); }} className="w-full bg-slate-900 h-14 rounded-2xl font-bold">Book a Suite</Button>
                </div>
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-32 px-4 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -mr-64 -mb-64" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-2xl active:scale-95 transition-transform">
              <Hotel className="w-6 h-6 text-slate-900" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tighter text-white">REGENCY</span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
            Experience the definitive standard of luxury and world-class hospitality in the heart of the city. 
          </p>
          <div className="flex gap-5">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 cursor-pointer transition-all shadow-xl active:scale-90">
                    <Icon className="w-5 h-5" />
                </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">Quick Navigation</h4>
          <ul className="space-y-5 text-sm font-medium">
            <li><Link to="/rooms" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">The Residences</Link></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Exquisite Dining</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Wellness & Spa</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Private Events</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Concierge Services</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">Support & Policies</h4>
          <ul className="space-y-5 text-sm font-medium">
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Help Center</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Booking Terms</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all hover:translate-x-1 inline-block">Travel Agents</a></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">Global Concierge</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-amber-500 shrink-0" />
                <span className="text-sm leading-relaxed">123 Luxury Ave, Victoria Island, Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
                <Phone className="w-6 h-6 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold group-hover:text-amber-400 transition-colors">+234 800 REGENCY</span>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
                <Mail className="w-6 h-6 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold group-hover:text-amber-400 transition-colors">concierge@regency.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        <p>&copy; {new Date().getFullYear()} The Grand Regency Victoria Island.</p>
        <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const { fetchInitialData } = useHotelStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-900">
        <Navbar />
        <main>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<Auth />} />
            </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </div>
    </Router>
  );
}

export default App;