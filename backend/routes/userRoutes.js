import express from 'express';
import {fetchCurrentUser, fetchUser, updateUserDetails, userLogout} from "../controllers/userController.js";

const router = express.Router();

// Routes for validated users, meaning users who have logged in (session initialised)
router.get('/user-logout', userLogout)

router.post('/fetch-user', fetchUser) // Fetching the users credentials via the specified document object - (For showing listing host)

router.get('/fetch-current-user', fetchCurrentUser) // Fetching the currently loggedIn user - (For NavBar)

router.post('/update-user-details', updateUserDetails)
export default router;