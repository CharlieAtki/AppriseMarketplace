import express from "express";
import {userCreation, userLogin} from "../controllers/userController.js";
import {authCheck} from "../controllers/authCheck.js";

const router = express.Router();

// Routes for the user controller
router.post("/add-user", userCreation)
router.post("/user-login", userLogin);

// AuthCheck Route
router.get("/auth-check", authCheck);

export default router;