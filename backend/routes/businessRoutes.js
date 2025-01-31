import express from 'express';
import {becomeABusiness, businessLogout, fetchListings, listingCreation} from "../controllers/businessController.js";

const router = express.Router();

// Routes go below
router.get('/business-logout', businessLogout)
router.post('/become-a-business', becomeABusiness)
router.post('/create-listing', listingCreation)
router.get('/fetch-listings', fetchListings)

export default router;