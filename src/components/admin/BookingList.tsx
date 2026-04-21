import React from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Briefcase, Clock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BookingList: React.FC = () => {
  const { bookings, updateBooking } = useHotelStore();

  const handleStatusChange = (id: string, status: any) => {
    updateBooking(id, { status });
    toast.success(`Booking ${status} successfully`);
  };

  return (
    <Card className="border-none shadow-sm animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle>Master Booking List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Stay Details</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400">No bookings found</TableCell>
                </TableRow>
            ) : (
                bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{booking.fullName || booking.guestName}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {booking.guestEmail}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium">{booking.roomName}</span>
                            <span className="text-xs text-slate-500">
                                {booking.checkIn} to {booking.checkOut}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {booking.occupation || 'N/A'}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {booking.expectedArrivalTime || 'N/A'}
                        </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">₦{booking.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                    <Badge 
                        className={cn(
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700',
                        'border-none font-semibold'
                        )}
                    >
                        {booking.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        {booking.status === 'pending' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
                        </Button>
                        )}
                        {booking.status !== 'cancelled' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                            <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                        )}
                    </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default BookingList;