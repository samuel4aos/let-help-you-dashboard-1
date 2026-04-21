export type UserRole = 'guest' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
  price: number;
  capacity: number;
  description: string;
  images: string[];
  amenities: string[];
  status: 'available' | 'booked' | 'maintenance';
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  roomName?: string; // For display purposes
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface HotelInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  images: string[];
  policies: string[];
}