import { create } from 'zustand';
import { User, Room, Booking, HotelInfo, Staff } from '../types';
import { supabase } from '../lib/supabase';

interface HotelState {
  user: User | null;
  rooms: Room[];
  bookings: Booking[];
  staff: Staff[];
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
  addStaff: (staff: Staff) => Promise<void>;
  updateStaff: (id: string, staff: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  updateHotelInfo: (info: Partial<HotelInfo>) => Promise<void>;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  user: null,
  rooms: [],
  bookings: [],
  staff: [],
  isLoading: false,
  hotelInfo: {
    name: 'The Grand Regency',
    description: '',
    address: '',
    phone: '',
    email: '',
    images: [],
    policies: [],
  },

  setUser: (user) => set({ user }),

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Fetch Hotel Info
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('*')
        .single();
      
      if (hotelData) {
        set({ hotelInfo: hotelData });
      }

      // Fetch Rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*');
      
      if (roomsData) {
        set({ rooms: roomsData });
      }

      // Fetch Bookings (if user is logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          set({ user: profile });
          
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('*, rooms(name)')
            .eq('user_id', session.user.id);
          
          if (bookingsData) {
            set({ bookings: bookingsData.map(b => ({
              ...b,
              roomName: b.rooms?.name
            })) });
          }
        }
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
    const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
    if (!error && data) {
      set((state) => ({ bookings: [data, ...state.bookings] }));
    }
  },

  updateBooking: async (id, updatedBooking) => {
    const { error } = await supabase.from('bookings').update(updatedBooking).eq('id', id);
    if (!error) {
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)),
      }));
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

  addStaff: async (staff) => {
    // Note: Staff management involves creating auth users, which usually happens via edge functions
    set((state) => ({ staff: [...state.staff, staff] }));
  },

  updateStaff: async (id, updatedStaff) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)),
    }));
  },

  deleteStaff: async (id) => {
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    }));
  },

  updateHotelInfo: async (info) => {
    const { error } = await supabase.from('hotels').update(info).eq('id', (get().hotelInfo as any).id);
    if (!error) {
      set((state) => ({
        hotelInfo: { ...state.hotelInfo, ...info },
      }));
    }
  },
}));