# Fix Runtime Errors: userId Property on Booking Type

The application is experiencing TypeScript/Runtime errors because the `Booking` type no longer includes a `userId` property, but it is still being accessed and assigned in several components. This is part of the transition to a guest-booking flow where a logged-in user is not required.

## Proposed Changes

### 1. `src/components/booking/BookingDialog.tsx`
- Remove the requirement for a logged-in user before booking.
- Remove the assignment of `userId` to the `newBooking` object.
- Provide default values for required `Booking` properties (`guestName`, `guestEmail`, `guestPhone`) using `user` info if available.

### 2. `src/pages/guest/MyBookings.tsx`
- Remove the usage of `userId` when filtering bookings.
- Update the filtering logic to use `guestEmail` (matched against the logged-in user's email) to show bookings relevant to the user.
- If no user is logged in, show a state appropriate for guests (currently the page requires login, which we will preserve but fix the filtering logic).

### 3. Verification
- Run `validate_build` to ensure all TypeScript errors are resolved and the application builds successfully.

## Risks
- If the database still requires `user_id`, the insertion might fail. However, the project context indicates a migration was applied to allow guest bookings.
- The `Booking` interface requires `guestName`, `guestEmail`, and `guestPhone`. We must ensure these are provided when creating a booking.
