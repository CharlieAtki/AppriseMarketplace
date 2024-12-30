import express from 'express';
import {userLogout} from "../controllers/userController.js";

const router = express.Router();

// Routes for validated users, meaning users who have logged in (session initialised)
router.get('/user-logout', userLogout)

export default router;