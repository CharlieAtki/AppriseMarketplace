import express from "express";
import {userCreation, userLogin} from "../controllers/userController.js";
import {authCheck} from "../controllers/authCheck.js";
import {businessCreation, businessLogin} from "../controllers/businessController.js";

const router = express.Router();

// Routes for the user controller
router.post("/add-user", userCreation)
router.post("/user-login", userLogin);

// Routes for the business controller
router.post("/add-business", businessCreation) // not made yet
router.post("/business-login", businessLogin); // business login route

// AuthCheck Route
router.get("/auth-check", authCheck);

export default router;