import { create } from 'zustand';
import { User, Room, Booking, HotelInfo } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface HotelState {
  user: User | null;
  rooms: Room[];
  bookings: Booking[];
  hotelInfo: HotelInfo;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchInitialData: () => Promise<void>;
  addRoom: (room: Room) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updateHotelInfo: (info: Partial<HotelInfo>) => Promise<void>;
}

// Helper to map DB booking to Frontend booking
const mapBookingFromDB = (b: any): Booking => ({
  id: b.id,
  roomId: b.room_id,
  guestName: b.guest_name,
  guestEmail: b.guest_email,
  guestPhone: b.guest_phone || '',
  fullName: b.full_name || '',
  occupation: b.occupation || '',
  expectedArrivalTime: b.expected_arrival_time || '',
  checkIn: b.check_in,
  checkOut: b.check_out,
  totalPrice: Number(b.total_price),
  status: b.status,
  paymentStatus: b.payment_status,
  createdAt: b.created_at,
  roomName: b.rooms?.name || b.roomName,
});

// Helper to map Frontend booking to DB booking
const mapBookingToDB = (b: Partial<Booking>) => {
  const mapped: any = {};
  if (b.roomId) mapped.room_id = b.roomId;
  if (b.guestName) mapped.guest_name = b.guestName;
  if (b.guestEmail) mapped.guest_email = b.guestEmail;
  if (b.guestPhone !== undefined) mapped.guest_phone = b.guestPhone;
  if (b.fullName !== undefined) mapped.full_name = b.fullName;
  if (b.occupation !== undefined) mapped.occupation = b.occupation;
  if (b.expectedArrivalTime !== undefined) mapped.expected_arrival_time = b.expectedArrivalTime;
  if (b.checkIn) mapped.check_in = b.checkIn;
  if (b.checkOut) mapped.check_out = b.checkOut;
  if (b.totalPrice !== undefined) mapped.total_price = b.totalPrice;
  if (b.status) mapped.status = b.status;
  if (b.paymentStatus) mapped.payment_status = b.paymentStatus;
  return mapped;
};

export const useHotelStore = create<HotelState>((set, get) => ({
  user: null,
  rooms: [],
  bookings: [],
  isLoading: false,
  hotelInfo: {
    name: 'The Grand Regency',
    description: 'Exquisite urban living in the heart of the city.',
    address: '123 Luxury Ave, Victoria Island, Lagos, Nigeria',
    phone: '+234 800 REGENCY',
    email: 'concierge@regency.com',
    images: [],
    policies: ['No smoking in rooms', 'Check-in: 2:00 PM', 'Check-out: 12:00 PM'],
    adminPassword: 'admin123',
    heroTitle: 'Redefining Elegance',
    heroSubtitle: 'An oasis of refined luxury, where impeccable service meets architectural brilliance.',
    heroImage: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/hotel-lobby-6673bcb5-1776794071145.webp',
    aboutTitle: 'The Art of Modern Hospitality',
    aboutDescription: 'At Regency, we believe luxury is in the details. From our curated art collection to our personalized concierge service, every moment is crafted to perfection.',
    experienceImage: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/87fdac91-6420-4b2c-9c11-c405f851854e/rooftop-pool-0c141681-1776794070496.webp',
    experienceItems: [
        { icon: 'ShieldCheck', title: 'Total Privacy', desc: 'Secure, private access and soundproofed walls.' },
        { icon: 'MapPin', title: 'Premium Spot', desc: 'Located in the most prestigious district of Lagos.' },
        { icon: 'Sparkles', title: 'Bespoke Care', desc: 'Personal butler service available 24/7.' },
        { icon: 'CreditCard', title: 'Elite Rewards', desc: 'Join our club for exclusive perks and upgrades.' },
    ],
    lowerSectionTitle: 'Curated Collection',
    lowerSectionContent: 'Handpicked suites designed for the most discerning travelers, featuring bespoke Italian furniture and panoramic city views.',
  },

  setUser: (user) => set({ user }),

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('*')
        .single();
      
      if (hotelData) {
        set({ hotelInfo: { ...get().hotelInfo, ...hotelData } });
      }

      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*');
      
      if (roomsData) {
        set({ rooms: roomsData });
      }

      const { data: { session } } = await supabase.auth.getSession();
      let query = supabase.from('bookings').select('*, rooms(name)');
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          set({ user: profile });
          query = query.eq('guest_email', profile.email);
        }
      }

      const { data: bookingsData } = await query;
      if (bookingsData) {
        set({ bookings: bookingsData.map(mapBookingFromDB) });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addRoom: async (room) => {
    const { data, error } = await supabase.from('rooms').insert([room]).select().single();
    if (!error && data) {
      set((state) => ({ rooms: [...state.rooms, data] }));
    }
  },

  updateRoom: async (id, updatedRoom) => {
    const { error } = await supabase.from('rooms').update(updatedRoom).eq('id', id);
    if (!error) {
      set((state) => ({
        rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...updatedRoom } : r)),
      }));
    }
  },

  deleteRoom: async (id) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (!error) {
      set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id),
      }));
    }
  },

  addBooking: async (booking) => {
    const dbBooking = mapBookingToDB(booking);
    const { data, error } = await supabase.from('bookings').insert([dbBooking]).select('*, rooms(name)').single();
    if (!error && data) {
      set((state) => ({ bookings: [mapBookingFromDB(data), ...state.bookings] }));
    } else if (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  },

  updateBooking: async (id, updatedBooking) => {
    const dbBooking = mapBookingToDB(updatedBooking);
    const { error } = await supabase.from('bookings').update(dbBooking).eq('id', id);
    if (!error) {
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)),
      }));
    } else {
        console.error('Error updating booking:', error);
        throw error;
    }
  },

  deleteBooking: async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
      }));
    }
  },

  updateHotelInfo: async (info) => {
    const currentInfo = get().hotelInfo;
    const hotelId = currentInfo.id;
    
    let targetId = hotelId;
    if (!targetId) {
      const { data } = await supabase.from('hotels').select('id').single();
      if (data) targetId = data.id;
    }

    if (targetId) {
      const { error } = await supabase.from('hotels').update(info).eq('id', targetId);
      if (error) {
        console.error('Error updating hotel info:', error);
        toast.error('Failed to save changes to database');
        return;
      }
    }

    set((state) => ({
      hotelInfo: { ...state.hotelInfo, ...info },
    }));
  },
}));