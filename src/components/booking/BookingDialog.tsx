import React, { useState } from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Room, Booking } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BookingDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ room, isOpen, onClose }) => {
  const { user, addBooking } = useHotelStore();
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  if (!room) return null;

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights * room.price;

  const handleBooking = () => {
    if (!date?.from || !date?.to || nights <= 0) {
      toast.error('Please select valid dates');
      return;
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: room.id,
      roomName: room.name,
      guestName: user?.name || 'Guest',
      guestEmail: user?.email || 'guest@example.com',
      guestPhone: '',
      checkIn: format(date.from, 'yyyy-MM-dd'),
      checkOut: format(date.to, 'yyyy-MM-dd'),
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    toast.success('Room booked successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Confirm Your Stay</DialogTitle>
          <DialogDescription>
            {room.name} • ${room.price} per night
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4">
            <label className="text-sm font-bold text-slate-700">Select Dates</label>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-semibold">Check-in</label>
                    <div className="p-3 border rounded-xl flex items-center gap-2 bg-slate-50">
                        <CalendarIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">{date?.from ? format(date.from, 'MMM dd, yyyy') : 'Select'}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-slate-500 uppercase font-semibold">Check-out</label>
                    <div className="p-3 border rounded-xl flex items-center gap-2 bg-slate-50">
                        <CalendarIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">{date?.to ? format(date.to, 'MMM dd, yyyy') : 'Select'}</span>
                    </div>
                </div>
            </div>
            
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={{ from: date?.from, to: date?.to }}
                onSelect={(range: any) => setDate(range)}
                numberOfMonths={1}
                className="rounded-xl border shadow-sm mx-auto"
            />
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{room.price} x {nights} nights</span>
              <span className="font-bold">${totalPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Taxes & Fees</span>
              <span className="font-bold">$0</span>
            </div>
            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-amber-400">${totalPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-100">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <p>Your booking is protected by our Regency Guarantee. Free cancellation until 24h before check-in.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl h-12">Cancel</Button>
          <Button onClick={handleBooking} className="bg-slate-900 h-12 rounded-xl flex-1">
            <CreditCard className="mr-2 w-4 h-4" /> Pay & Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;