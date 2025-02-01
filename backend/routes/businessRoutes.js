import express from 'express';
import {becomeABusiness, businessLogout, fetchListings, listingCreation} from "../controllers/businessController.js";

const router = express.Router();

// Routes for managing user sessions
router.get('/business-logout', businessLogout)

// Routes for managing role conversion
router.post('/become-a-business', becomeABusiness)

// Routes for managing listings
router.post('/create-listing', listingCreation)
router.get('/fetch-listings', fetchListings)

export default router;