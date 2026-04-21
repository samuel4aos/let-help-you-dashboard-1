# Implementation Plan - Regency Hotel Management System

Implement a production-ready UI/UX for the Regency Hotel, focusing on navigation, interactivity, and responsiveness.

## 1. Core Infrastructure & State
- [x] Review existing Zustand store (`useHotelStore.ts`)
- [ ] Add `staff` to store state and management functions
- [ ] Implement simulated "loading" states for better UX during "API" calls

## 2. Authentication & Navigation
- [ ] Enhance `src/pages/Auth.tsx` with validation and better mock logic
- [ ] Update `src/App.tsx` with:
    - Protected routes for Admin
    - New route: `/profile` or `/my-bookings` for guests
    - Refined navigation with active states

## 3. Guest Experience (Interactivity)
- [ ] **Home Page (`Home.tsx`)**:
    - Functional search bar (Check-in, Check-out, Guests) that navigates to `/rooms` with filters
- [ ] **Rooms Page (`Rooms.tsx`)**:
    - Implement real-time filtering (Price, Type, Amenities)
    - Implement search functionality
    - Integrated **Booking Dialog**: Modal to confirm dates and book
- [ ] **My Bookings Page**:
    - New page for guests to view their past and upcoming stays

## 4. Admin Experience (Dashboard)
- [ ] **Room Management**:
    - Implement "Add Room" and "Edit Room" using Shadcn Dialogs
    - Form validation for room details
- [ ] **Booking Management**:
    - Interactive table to view, confirm, or cancel guest bookings
- [ ] **Staff Management**:
    - Simple interface to list and manage hotel staff
- [ ] **Hotel Settings**:
    - Form to update hotel name, contact info, and policies

## 5. UI/UX Polishing
- [ ] **Animations**: Add `framer-motion` page transitions and staggered list animations
- [ ] **Feedback**: Use `sonner` for all success/error notifications
- [ ] **Responsiveness**: Ensure 100% mobile-friendliness for all new components (Dialogs, Tables, Forms)
- [ ] **Accessibility**: Add ARIA labels and keyboard navigation support

## 6. Final Polish & Bug Fixes
- [ ] Test all navigation flows
- [ ] Validate form inputs
- [ ] Ensure consistent color palette (Slate & Amber) across all components
