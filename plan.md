1. Remove Staff Module:
   - Delete `src/components/admin/StaffList.tsx` (already done).
   - Remove `Staff` interface from `src/types/index.ts`.
   - Remove staff state and methods from `src/store/useHotelStore.ts`.
   - Remove "Staff" tab and all references to `StaffList` in `src/pages/admin/Dashboard.tsx`.

2. Implement Password-Only Admin Auth:
   - Update `src/types/index.ts` to include `adminPassword` in `HotelInfo`.
   - Update `src/store/useHotelStore.ts` to include `adminPassword` (defaulting to 'admin123') in the `hotelInfo` state and ensure it's saved/fetched from Supabase.
   - Refactor `src/pages/Auth.tsx` to be a clean, password-only login screen.
   - Implement login logic in `Auth.tsx` that checks the entered password against `hotelInfo.adminPassword`.
   - On successful login, set the user in the store and redirect to `/admin`.

3. Add Password Change Feature:
   - Update `src/components/admin/HotelSettings.tsx` to include a "Security" tab.
   - In the "Security" tab, add a form to change the admin password.
   - The form should require the "Current Password", "New Password", and "Confirm New Password".
   - Implement the `updateAdminPassword` logic (which will just be a call to `updateHotelInfo`).

4. Cleanup:
   - Remove unused imports and icons across affected files.
   - Ensure all references to Supabase Auth are replaced with our custom admin auth where appropriate (guest auth can remain if it uses Supabase, but the prompt focuses on the admin).
   - Update `App.tsx` logout logic to handle the local user state correctly.