import express from 'express';
import {
    becomeABusiness,
    bookingCreation, bookingDateAvailabilityCheck,
    businessLogout, fetchAggregatedBookingData, fetchBookings,
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

// Routes for managing listing analyticsCharts
router.get('/fetch-aggregate-booking-data', fetchAggregatedBookingData)

export default router;