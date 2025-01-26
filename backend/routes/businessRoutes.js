import express from 'express';
import {businessLogout} from "../controllers/businessController.js";

const router = express.Router();

// Routes go below
router.get('/business-logout', businessLogout)

export default router;