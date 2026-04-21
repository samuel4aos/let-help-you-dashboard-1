1. Update Hotel Info Schema: Expand `HotelInfo` in `src/types/index.ts` to include fields for the front page (hero title, subtitle, images, experience section, etc.).
2. Enhance Hotel Store: Update `src/store/useHotelStore.ts` to manage the new hotel information fields and ensure persistence to Supabase.
3. Admin Front-Page Editor: Modify `src/components/admin/HotelSettings.tsx` to provide a comprehensive UI for editing all guest-facing content, including image uploads.
4. Dynamic Guest Home Page: Update `src/pages/guest/Home.tsx` to consume data from the store, replacing hardcoded content with administrator-defined text and images.
5. Global Currency Replacement: Search and replace the '$' symbol with the Nigerian Naira (₦) symbol across the entire application (Rooms, Home, Bookings, Admin).
6. Validation: Ensure all changes are reflected correctly in both the guest and admin interfaces and that the build passes.