import express from "express";
import {userCreation} from "../controllers/userController.js";

const router = express.Router();

router.post("/add-user", userCreation)

export default router;