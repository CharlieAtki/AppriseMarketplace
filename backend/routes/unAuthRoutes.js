import express from "express";
import {userCreation, userLogin} from "../controllers/userController.js";
import {authCheck} from "../controllers/authCheck.js";
import {businessCreation, businessLogin, roleCheck} from "../controllers/businessController.js";

const router = express.Router();

// Routes for the user controller
router.post("/add-user", userCreation)
router.post("/user-login", userLogin);

// Routes for the business controller
router.post("/add-business", businessCreation) // not made yet - This is now redundant (the
router.post("/business-login", businessLogin); // business login route

// Role check
router.get("/role-check", roleCheck); // fetches the users role from the session

// AuthCheck Route
router.get("/auth-check", authCheck);

export default router;