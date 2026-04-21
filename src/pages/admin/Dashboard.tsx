import React, { useState } from 'react';
import { useHotelStore } from '../../store/useHotelStore';
import { LayoutDashboard, BedDouble, CalendarCheck, Settings, LogOut, Menu, Bell, Search, Plus, Edit, Trash2, TrendingUp, DollarSign, Hotel, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import RoomDialog from '@/components/admin/RoomDialog';
import BookingList from '@/components/admin/BookingList';
import HotelSettings from '@/components/admin/HotelSettings';
import { Room } from '@/types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { rooms, bookings, deleteRoom, setUser, hotelInfo } = useHotelStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'settings'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter(r => r.status === 'booked').length;
  const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

  const stats = [
    { title: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Revenue', value: `\u20a6${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Occupancy Rate', value: `${occupancyRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Available Rooms', value: rooms.filter(r => r.status === 'available').length, icon: BedDouble, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.guestName}</TableCell>
                      <TableCell>{item.roomName || 'Unknown Room'}</TableCell>
                      <TableCell>{format(new Date(item.checkIn), 'MMM d')} - {format(new Date(item.checkOut), 'MMM d')}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'} className="rounded-lg px-2">
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 font-medium">
                      No recent bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start py-6 bg-slate-900 rounded-xl group" onClick={() => { setEditingRoom(null); setIsRoomDialogOpen(true); }}>
              <Plus className="mr-2 w-4 h-4 transition-transform group-hover:rotate-90" /> Add New Room
            </Button>
            <Button variant="outline" className="w-full justify-start py-6 rounded-xl" onClick={() => setActiveTab('bookings')}>
              <Search className="mr-2 w-4 h-4" /> Manage Bookings
            </Button>
            <Button variant="outline" className="w-full justify-start py-6 rounded-xl" onClick={() => setActiveTab('settings')}>
              <Hotel className="mr-2 w-4 h-4" /> Hotel Settings
            </Button>
            <Button variant="outline" className="w-full justify-start py-6 rounded-xl" onClick={() => setActiveTab('settings')}>
              <Shield className="mr-2 w-4 h-4" /> Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-10 bg-white rounded-xl border-slate-200" placeholder="Search rooms..." />
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 rounded-xl" onClick={() => { setEditingRoom(null); setIsRoomDialogOpen(true); }}>
          <Plus className="mr-2 w-4 h-4" /> Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-3xl group bg-white">
            <div className="h-48 overflow-hidden">
              <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{room.name}</h4>
                <Badge variant={room.status === 'available' ? 'default' : 'secondary'} className="rounded-lg">{room.status}</Badge>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{room.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="font-bold text-amber-600 text-lg">\u20a6{room.price.toLocaleString()}<span className="text-slate-400 text-xs font-normal">/night</span></span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => { setEditingRoom(room); setIsRoomDialogOpen(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                        deleteRoom(room.id);
                        toast.success("Room deleted successfully");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className={`bg-slate-900 text-white w-72 fixed h-full transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-amber-500 p-2.5 rounded-2xl shadow-lg shadow-amber-500/20">
              <Hotel className="w-7 h-7 text-slate-900" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">{hotelInfo.name.split(' ').pop()?.toUpperCase()}</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'rooms', icon: BedDouble, label: 'Room Management' },
              { id: 'bookings', icon: CalendarCheck, label: 'Bookings' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm transition-all ${activeTab === item.id ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-8 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-5 py-2">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Management Suite</p>
              <h2 className="text-2xl font-bold capitalize text-slate-800">{activeTab === 'overview' ? 'General Manager' : activeTab === 'settings' ? 'Management Suite' : activeTab}</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-900 h-12 w-12 rounded-2xl bg-slate-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </Button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{hotelInfo.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">General Manager</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 font-bold text-lg shadow-lg">
                {getInitials(hotelInfo.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-10">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'rooms' && renderRooms()}
          {activeTab === 'bookings' && <BookingList />}
          {activeTab === 'settings' && <HotelSettings />}
        </div>
      </main>

      <RoomDialog 
        room={editingRoom} 
        isOpen={isRoomDialogOpen} 
        onClose={() => { setIsRoomDialogOpen(false); setEditingRoom(null); }} 
      />
    </div>
  );
};

export default AdminDashboard;