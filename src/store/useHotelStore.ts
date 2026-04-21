import { create } from 'zustand';
import { User, Room, Booking, HotelInfo, Staff } from '../types';

interface HotelState {
  user: User | null;
  rooms: Room[];
  bookings: Booking[];
  staff: Staff[];
  hotelInfo: HotelInfo;
  setUser: (user: User | null) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  updateHotelInfo: (info: Partial<HotelInfo>) => void;
}

export const useHotelStore = create<HotelState>((set) => ({
  user: null,
  rooms: [
    {
      id: '1',
      name: 'Royal Ocean Suite',
      type: 'Suite',
      price: 450,
      capacity: 2,
      description: 'Experience ultimate luxury with panoramic ocean views and bespoke amenities.',
      images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/luxury-suite-3d280c52-1776794071152.webp'],
      amenities: ['Ocean View', 'King Bed', 'Private Balcony', 'Mini Bar', 'Free WiFi'],
      status: 'available',
    },
    {
      id: '2',
      name: 'Deluxe Garden Room',
      type: 'Deluxe',
      price: 280,
      capacity: 2,
      description: 'A serene sanctuary overlooking our lush botanical gardens.',
      images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/standard-room-25b83b42-1776794070257.webp'],
      amenities: ['Garden View', 'Queen Bed', 'Smart TV', 'Workspace'],
      status: 'available',
    },
    {
      id: '3',
      name: 'Presidential Penthouse',
      type: 'Presidential',
      price: 1200,
      capacity: 4,
      description: 'The pinnacle of luxury living. A sprawling penthouse with 360-degree city views.',
      images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/luxury-suite-3d280c52-1776794071152.webp'],
      amenities: ['Private Pool', 'Butler Service', 'Home Theater', 'Kitchen'],
      status: 'available',
    }
  ],
  bookings: [
    {
      id: 'b1',
      userId: '1',
      roomId: '1',
      roomName: 'Royal Ocean Suite',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      totalPrice: 2250,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    }
  ],
  staff: [
    { id: 's1', name: 'John Smith', role: 'General Manager', email: 'john@regency.com', status: 'active' },
    { id: 's2', name: 'Sarah Wilson', role: 'Concierge', email: 'sarah@regency.com', status: 'active' },
  ],
  hotelInfo: {
    name: 'The Grand Regency',
    description: 'A sanctuary of elegance and modern luxury in the heart of the city.',
    address: '123 Luxury Ave, Victoria Island, Lagos',
    phone: '+234 800 REGENCY',
    email: 'contact@grandregency.com',
    images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/hotel-lobby-6673bcb5-1776794071145.webp'],
    policies: ['Check-in: 2:00 PM', 'Check-out: 11:00 AM', 'No Smoking', 'No Pets'],
  },
  setUser: (user) => set({ user }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  updateRoom: (id, updatedRoom) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...updatedRoom } : r)),
    })),
  deleteRoom: (id) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== id),
    })),
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  updateBooking: (id, updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)),
    })),
  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
  addStaff: (staff) => set((state) => ({ staff: [...state.staff, staff] })),
  updateStaff: (id, updatedStaff) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)),
    })),
  deleteStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    })),
  updateHotelInfo: (info) =>
    set((state) => ({
      hotelInfo: { ...state.hotelInfo, ...info },
    })),
}));