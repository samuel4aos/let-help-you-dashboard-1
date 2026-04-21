import React, { useState, useMemo } from 'react';
import { useHotelStore } from '../../store/useHotelStore';
import { Search, Filter, SlidersHorizontal, Users, Wifi, Wind, Coffee, Tv, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import BookingDialog from '@/components/booking/BookingDialog';
import { Room } from '@/types';

const Rooms: React.FC = () => {
  const { rooms } = useHotelStore();
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Wind, label: 'Air Conditioning' },
    { icon: Coffee, label: 'Mini Bar' },
    { icon: Tv, label: 'Smart TV' },
  ];

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           room.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = room.price <= priceRange[1];
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(room.type);
      return matchesSearch && matchesPrice && matchesType;
    });
  }, [rooms, searchQuery, priceRange, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <Badge className="bg-amber-100 text-amber-700 border-none mb-4 font-bold">Luxury Stays</Badge>
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Our Residences</h1>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">Choose from our curated collection of masterfully designed rooms, each offering a unique perspective of the city.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="border-none shadow-xl rounded-[2rem] sticky top-28 overflow-hidden">
              <CardContent className="p-8 space-y-10">
                <div>
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-amber-500" /> Refine Search
                  </h4>
                  <div className="space-y-6">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Range</Label>
                    <Slider
                      defaultValue={[0, 1500]}
                      max={1500}
                      step={100}
                      value={[0, priceRange[1]]}
                      onValueChange={(val) => setPriceRange([0, val[0]])}
                      className="mt-4"
                    />
                    <div className="flex justify-between text-sm font-bold text-slate-900">
                      <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">$0</span>
                      <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Residence Type</Label>
                  <div className="space-y-3">
                    {['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'].map((type) => (
                      <div key={type} className="flex items-center space-x-3 cursor-pointer group">
                        <Checkbox 
                            id={type} 
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                            className="rounded-md border-slate-200 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <Label 
                            htmlFor={type} 
                            className="text-base font-medium text-slate-600 group-hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Luxury Amenities</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {amenities.map((item) => (
                      <div key={item.label} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-50 hover:border-slate-200 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-slate-400" /> 
                        </div>
                        <span className="text-sm font-medium text-slate-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-slate-900 h-14 rounded-2xl font-bold shadow-lg shadow-slate-900/10" onClick={() => { setSelectedTypes([]); setPriceRange([0, 1500]); setSearchQuery(''); }}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Rooms Grid */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-4 bg-white p-3 rounded-3xl shadow-xl border border-slate-100 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                    className="border-none focus-visible:ring-0 pl-14 h-14 bg-transparent text-lg placeholder:text-slate-400"
                    placeholder="Search for city views, suite names, or floor levels..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="icon" variant="ghost" className="h-14 w-14 rounded-2xl hover:bg-slate-50">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredRooms.map((room) => (
                    <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    >
                    <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-700 group rounded-[2.5rem] bg-white">
                        <div className="relative h-72 overflow-hidden">
                        <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                            <Badge className="bg-white/95 text-slate-900 backdrop-blur-md border-none font-bold px-4 py-2 rounded-xl shadow-lg">
                            {room.type}
                            </Badge>
                        </div>
                        </div>
                        <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <div className="flex text-amber-400 mb-1">
                                    {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                                </div>
                                <h3 className="text-2xl font-serif text-slate-900 group-hover:text-amber-600 transition-colors">{room.name}</h3>
                                <div className="flex items-center text-slate-400 text-sm font-bold tracking-tight uppercase">
                                    <Users className="w-4 h-4 mr-2 text-amber-500" /> {room.capacity} Guests Max
                                </div>
                            </div>
                            <div className="text-right">
                            <span className="block text-3xl font-bold text-slate-900">${room.price}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Per Night</span>
                            </div>
                        </div>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed line-clamp-2 italic">
                            "{room.description}"
                        </p>
                        <div className="flex flex-wrap gap-2 mb-10">
                            {room.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg border border-slate-100">
                                {amenity}
                            </Badge>
                            ))}
                        </div>
                        <Button 
                            onClick={() => setBookingRoom(room)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl transition-all group shadow-lg shadow-slate-900/10"
                        >
                            Book Residence <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                        </CardContent>
                    </Card>
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredRooms.length === 0 && (
              <div className="py-20 text-center space-y-6">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-serif text-slate-900">No matching residences found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search terms to find the perfect stay.</p>
                <Button variant="outline" className="rounded-xl h-12" onClick={() => { setSelectedTypes([]); setPriceRange([0, 1500]); setSearchQuery(''); }}>
                    Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingDialog 
        room={bookingRoom} 
        isOpen={!!bookingRoom} 
        onClose={() => setBookingRoom(null)} 
      />
    </div>
  );
};

export default Rooms;