-- Create Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price NUMERIC NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Bookings table with Guest details
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for Rooms
CREATE POLICY "Rooms are viewable by everyone" 
ON public.rooms FOR SELECT 
USING (true);

CREATE POLICY "Rooms are manageable by admins" 
ON public.rooms FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for Bookings
CREATE POLICY "Bookings can be created by anyone (anonymous guests)" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bookings are viewable by admins/staff" 
ON public.bookings FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Bookings are manageable by admins/staff" 
ON public.bookings FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create an index on guest_email
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON public.bookings(guest_email);

-- Function to notify on new booking (placeholder for actual edge function call if using pg_net)
-- For now, we'll assume the frontend calls the edge function or we use a database webhook