import React from 'react';
import { useHotelStore } from '../../store/useHotelStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Phone, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MyBookings: React.FC = () => {
  const { user, bookings } = useHotelStore();
  
  const userBookings = bookings.filter(b => b.userId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-serif">Please login to view your bookings</h2>
          <Button onClick={() => window.location.href = '/auth'} className="bg-slate-900 rounded-xl">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">My Residences</h1>
            <p className="text-slate-500 text-lg">Manage your upcoming stays and past experiences.</p>
          </div>
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-4 py-2 rounded-full text-sm font-bold">
            {userBookings.length} Total Bookings
          </Badge>
        </div>

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your journey with Regency hasn't started yet. Browse our rooms and book your first stay.</p>
            <Button onClick={() => window.location.href = '/rooms'} className="bg-slate-900 rounded-xl px-8 h-12">Explore Rooms</Button>
          </div>
        ) : (
          <div className="grid gap-8">
            {userBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-4">
                    <div className="lg:col-span-1 h-48 lg:h-full">
                      <img 
                        src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/luxury-suite-3d280c52-1776794071152.webp" 
                        alt="Room" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="lg:col-span-3 p-8">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-green-100 text-green-700 border-none font-bold">{booking.status.toUpperCase()}</Badge>
                              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">#{booking.id}</span>
                            </div>
                            <h3 className="text-2xl font-serif text-slate-900">{booking.roomName}</h3>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Check-In
                              </span>
                              <p className="font-bold text-slate-900">{booking.checkIn}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Check-Out
                              </span>
                              <p className="font-bold text-slate-900">{booking.checkOut}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Total Paid
                              </span>
                              <p className="font-bold text-slate-900">${booking.totalPrice}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-end min-w-[160px]">
                          <Button variant="outline" className="rounded-xl">View Details</Button>
                          <Button className="bg-slate-900 rounded-xl group">
                            Contact Concierge <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-4 h-4 text-amber-500" /> 123 Luxury Ave, Victoria Island
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Phone className="w-4 h-4 text-amber-500" /> +234 800 REGENCY
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4 text-amber-500" /> Check-in: 2:00 PM
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;