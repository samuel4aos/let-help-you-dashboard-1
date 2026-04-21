export type UserRole = 'guest' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: 'active' | 'inactive';
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
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  fullName: string;
  occupation: string;
  expectedArrivalTime: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  roomName?: string;
}

export interface ExperienceItem {
  icon: string;
  title: string;
  desc: string;
}

export interface HotelInfo {
  id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  images: string[];
  policies: string[];
  adminPassword?: string;
  // Front Page Fields
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  experienceImage: string;
  experienceItems: ExperienceItem[];
  lowerSectionTitle: string;
  lowerSectionContent: string;
}