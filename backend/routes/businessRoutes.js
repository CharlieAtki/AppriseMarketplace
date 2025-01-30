import express from 'express';
import {becomeABusiness, businessLogout} from "../controllers/businessController.js";

const router = express.Router();

// Routes go below
router.get('/business-logout', businessLogout)
router.post('/become-a-business', becomeABusiness)

export default router;