import React, { useState } from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Room } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';

interface RoomDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDialog: React.FC<RoomDialogProps> = ({ room, isOpen, onClose }) => {
  const { addRoom, updateRoom } = useHotelStore();
  const [formData, setFormData] = useState<Partial<Room>>(
    room || {
      name: '',
      type: 'Single',
      price: 0,
      capacity: 2,
      description: '',
      images: [],
      amenities: ['Free WiFi', 'Air Conditioning'],
      status: 'available',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (room) {
      updateRoom(room.id, formData);
      toast.success('Room updated successfully');
    } else {
      const newRoom = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Room;
      addRoom(newRoom);
      toast.success('Room added successfully');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-[32px] overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50/50">
          <DialogTitle className="text-3xl font-serif text-slate-900">{room ? 'Edit Room' : 'New Suite'}</DialogTitle>
          <p className="text-slate-500 text-sm mt-1">Define the details and imagery for this accommodation.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Room Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Royal Ocean Suite"
                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Room Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="Single">Single Room</SelectItem>
                  <SelectItem value="Double">Double Room</SelectItem>
                  <SelectItem value="Suite">Executive Suite</SelectItem>
                  <SelectItem value="Deluxe">Deluxe Suite</SelectItem>
                  <SelectItem value="Presidential">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Price per Night ($)</Label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} 
                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Capacity (Persons)</Label>
              <Input 
                type="number" 
                value={formData.capacity} 
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} 
                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gallery</Label>
            <ImageUploader 
              images={formData.images || []} 
              onChange={(images) => setFormData({ ...formData, images })} 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Describe the unique features and view of this room..."
              className="rounded-2xl min-h-[120px] bg-slate-50 border-slate-100 focus:bg-white transition-all py-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Amenities (Comma separated)</Label>
            <Input 
              value={formData.amenities?.join(', ')} 
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(s => s.trim()) })} 
              className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              placeholder="Free WiFi, 24/7 Butler, Ocean View"
            />
          </div>
        </form>

        <DialogFooter className="p-8 bg-slate-50/50 flex gap-4">
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl px-8 h-12 font-bold text-slate-500">Cancel</Button>
          <Button type="submit" onClick={handleSubmit} className="bg-slate-900 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-slate-900/10">{room ? 'Update Changes' : 'Publish Suite'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;