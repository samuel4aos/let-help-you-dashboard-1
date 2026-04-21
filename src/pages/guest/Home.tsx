import React, { useState } from 'react';
import { useHotelStore } from '../../store/useHotelStore';
import { Calendar, Users, Star, ArrowRight, ShieldCheck, CreditCard, Sparkles, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { rooms, hotelInfo } = useHotelStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000),
    guests: 2,
  });

  const handleSearch = () => {
    navigate(`/rooms?checkIn=${format(searchParams.checkIn, 'yyyy-MM-dd')}&checkOut=${format(searchParams.checkOut, 'yyyy-MM-dd')}&guests=${searchParams.guests}`);
  };

  // Helper to render dynamic icons
  const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <Icon className={className} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hotelInfo.heroImage || "https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/hotel-lobby-6673bcb5-1776794071145.webp"}
            alt="Hero"
            className="w-full h-full object-cover brightness-[0.4] scale-105 animate-subtle-zoom"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 backdrop-blur-md mb-6 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
              {hotelInfo.description || "Exquisite Urban Living"}
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1.1]">
              {hotelInfo.heroTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'elegance' || word.toLowerCase() === 'hospitality' ? 
                <span key={i} className="text-amber-400 italic">{word} </span> : 
                word + ' '
              )}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-12 text-slate-200 max-w-3xl mx-auto leading-relaxed">
              {hotelInfo.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col items-start px-6 py-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">Check-in</label>
                <div className="flex items-center text-white font-bold">
                  <Calendar className="w-4 h-4 mr-3 text-amber-400" />
                  <span className="text-lg">{format(searchParams.checkIn, 'dd MMM')}</span>
                </div>
              </div>
              <div className="flex flex-col items-start px-6 py-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">Check-out</label>
                <div className="flex items-center text-white font-bold">
                  <Calendar className="w-4 h-4 mr-3 text-amber-400" />
                  <span className="text-lg">{format(searchParams.checkOut, 'dd MMM')}</span>
                </div>
              </div>
              <div className="flex flex-col items-start px-6 py-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-2">Guests</label>
                <div className="flex items-center text-white font-bold">
                  <Users className="w-4 h-4 mr-3 text-amber-400" />
                  <span className="text-lg">{searchParams.guests} Adults</span>
                </div>
              </div>
              <Button onClick={handleSearch} className="h-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-3xl py-8 md:py-0 transition-all text-lg shadow-xl shadow-amber-500/20">
                Search Suites
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>Scroll to Explore</span>
            <div className="w-12 h-[1px] bg-white/20" />
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-32 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <Badge className="bg-amber-100 text-amber-700 border-none mb-4 font-bold">{hotelInfo.lowerSectionTitle}</Badge>
            <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Signature Residences</h2>
            <p className="text-slate-500 text-xl leading-relaxed">{hotelInfo.lowerSectionContent}</p>
          </div>
          <Button onClick={() => navigate('/rooms')} variant="ghost" className="text-amber-600 hover:text-amber-700 font-bold text-lg group h-14 px-8 rounded-2xl">
            View All Suites <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.slice(0, 3).map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -15 }}
              className="group cursor-pointer"
              onClick={() => navigate('/rooms')}
            >
              <Card className="overflow-hidden border-none shadow-xl group-hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white">
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-white/95 text-slate-900 backdrop-blur-md border-none font-bold px-5 py-2.5 rounded-2xl text-lg shadow-xl">
                      ₦{room.price.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent">
                     <div className="flex items-center text-amber-400 gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                     </div>
                     <h3 className="text-3xl font-serif text-white">{room.name}</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-slate-500 line-clamp-2 mb-6 text-lg">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-100 pt-6">
                    <span className="flex items-center font-bold"><Users className="w-4 h-4 mr-2 text-amber-500" /> {room.capacity} GUESTS</span>
                    <span className="flex items-center font-bold"><Sparkles className="w-4 h-4 mr-2 text-amber-500" /> {room.type.toUpperCase()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-slate-900 py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-[12px] border-slate-800 shadow-3xl">
              <img
                src={hotelInfo.experienceImage || "https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/rooftop-pool-0c141681-1776794070496.webp"}
                alt="Experience"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-amber-500 p-8 rounded-3xl shadow-2xl z-20">
                <p className="text-slate-900 font-bold text-4xl mb-1">4.9/5</p>
                <p className="text-slate-900/60 font-bold text-xs uppercase tracking-widest">Guest Satisfaction</p>
            </div>
          </div>
          <div className="space-y-10 order-1 lg:order-2">
            <Badge className="bg-amber-500 text-slate-900 font-bold px-4 py-1.5 rounded-full border-none">Beyond Stays</Badge>
            <h2 className="text-5xl md:text-6xl font-serif leading-[1.15]">
              {hotelInfo.aboutTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'hospitality' || word.toLowerCase() === 'elegance' ? 
                <span key={i} className="text-amber-400">{word} </span> : 
                word + ' '
              )}
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed">
              {hotelInfo.aboutDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {hotelInfo.experienceItems.map((item, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0 group-hover:bg-amber-500/10 transition-colors">
                    <DynamicIcon name={item.icon} className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-14 px-10 rounded-2xl text-lg">
                Read Our Story
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;