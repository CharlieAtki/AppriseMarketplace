import express from 'express';
import {fetchUser, userLogout} from "../controllers/userController.js";

const router = express.Router();

// Routes for validated users, meaning users who have logged in (session initialised)
router.get('/user-logout', userLogout)

router.post('/fetch-user', fetchUser) // Fetching the users credentials via the specified document object

export default router;