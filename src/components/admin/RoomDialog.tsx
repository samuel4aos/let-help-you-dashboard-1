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
      images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/standard-room-25b83b42-1776794070257.webp'],
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
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{room ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Room Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Royal Ocean Suite"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Presidential">Presidential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price per Night ($)</Label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} 
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity (Persons)</Label>
              <Input 
                type="number" 
                value={formData.capacity} 
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} 
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Enter room description..."
              className="rounded-xl min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities (Comma separated)</Label>
            <Input 
              value={formData.amenities?.join(', ')} 
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(s => s.trim()) })} 
              className="rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button type="submit" className="bg-slate-900 rounded-xl px-8">{room ? 'Update Room' : 'Add Room'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;