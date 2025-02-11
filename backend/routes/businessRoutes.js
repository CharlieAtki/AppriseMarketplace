import express from 'express';
import {
    becomeABusiness,
    bookingCreation, bookingDateAvailabilityCheck,
    businessLogout, fetchBookings,
    fetchListings,
    listingCreation
} from "../controllers/businessController.js";

const router = express.Router();

// Routes for managing user sessions
router.get('/business-logout', businessLogout)

// Routes for managing role conversion
router.post('/become-a-business', becomeABusiness)

// Routes for managing listings
router.post('/create-listing', listingCreation)
router.get('/fetch-listings', fetchListings)

// Routes for managing bookings
router.post('/create-booking', bookingCreation)
router.get('/check-booking-availability', bookingDateAvailabilityCheck)
router.get('/fetch-bookings', fetchBookings)

export default router;