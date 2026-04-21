import React, { useState } from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Room, Booking } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, CreditCard, ShieldCheck, User, Briefcase, Clock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '@/lib/supabase';

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

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    occupation: '',
    expectedArrivalTime: '',
  });

  if (!room) return null;

  const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights * room.price;

  // Paystack config
  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: totalPrice * 100, // Amount is in kobo, no longer assuming $ to NGN conversion as we use NGN natively
    publicKey: 'pk_test_306263593026210433282218320494429815598', // Placeholder test key
    metadata: {
        custom_fields: [
            {
                display_name: "Full Name",
                variable_name: "full_name",
                value: formData.fullName
            },
            {
                display_name: "Occupation",
                variable_name: "occupation",
                value: formData.occupation
            }
        ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    handleCompleteBooking(reference.reference);
  };

  const onClosePayment = () => {
    toast.error("Payment cancelled");
  };

  const handleCompleteBooking = async (paymentRef: string) => {
    const loadingToast = toast.loading('Finalizing your booking...');
    try {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: room.id,
        roomName: room.name,
        guestName: formData.fullName || 'Guest',
        guestEmail: formData.email,
        guestPhone: formData.phone,
        fullName: formData.fullName,
        occupation: formData.occupation,
        expectedArrivalTime: formData.expectedArrivalTime,
        checkIn: format(date!.from, 'yyyy-MM-dd'),
        checkOut: format(date!.to, 'yyyy-MM-dd'),
        totalPrice,
        status: 'confirmed', 
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };

      await addBooking(newBooking);
      
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
            body: { booking: newBooking, roomName: room.name }
        });
        toast.dismiss(loadingToast);
        toast.success('Booking confirmed! Check your email for details.');
      } catch (fnError) {
        console.error('Email trigger failed:', fnError);
        toast.dismiss(loadingToast);
        toast.success('Room booked successfully!'); 
      }
      
      onClose();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save booking. Please contact support.');
    }
  };

  const handleInitiatePayment = () => {
    if (!date?.from || !date?.to || nights <= 0) {
      toast.error('Please select valid dates');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.occupation || !formData.expectedArrivalTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    initializePayment({onSuccess, onClose: onClosePayment});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Complete Your Reservation</DialogTitle>
          <DialogDescription>
            {room.name} • ₦{room.price.toLocaleString()} per night
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700">Stay Duration</Label>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-500 uppercase font-semibold">Check-in</Label>
                    <div className="p-3 border rounded-xl flex items-center gap-2 bg-slate-50">
                        <CalendarIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">{date?.from ? format(date.from, 'MMM dd, yyyy') : 'Select'}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-slate-500 uppercase font-semibold">Check-out</Label>
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
                disabled={{ before: new Date() }}
            />
          </div>

          {/* Guest Details */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700">Guest Information</Label>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs text-slate-500 uppercase font-semibold">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            id="fullName" 
                            placeholder="John Doe" 
                            className="pl-10 rounded-xl"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs text-slate-500 uppercase font-semibold">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            className="pl-10 rounded-xl"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs text-slate-500 uppercase font-semibold">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            id="phone" 
                            placeholder="+234 ..." 
                            className="pl-10 rounded-xl"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-xs text-slate-500 uppercase font-semibold">Occupation</Label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            id="occupation" 
                            placeholder="Software Engineer" 
                            className="pl-10 rounded-xl"
                            value={formData.occupation}
                            onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="arrivalTime" className="text-xs text-slate-500 uppercase font-semibold">Expected Arrival Time</Label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            id="arrivalTime" 
                            type="time" 
                            className="pl-10 rounded-xl"
                            value={formData.expectedArrivalTime}
                            onChange={(e) => setFormData({...formData, expectedArrivalTime: e.target.value})}
                        />
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">₦{room.price.toLocaleString()} x {nights} nights</span>
              <span className="font-bold">₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Taxes & Fees</span>
              <span className="font-bold">₦0</span>
            </div>
            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-amber-400">₦{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-100">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <p>Secure payment via Paystack. Your booking is protected by our Regency Guarantee.</p>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl h-12 flex-1">Cancel</Button>
          <Button onClick={handleInitiatePayment} className="bg-slate-900 h-12 rounded-xl flex-[2]">
            <CreditCard className="mr-2 w-4 h-4" /> Pay & Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;