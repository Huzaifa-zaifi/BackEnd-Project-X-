import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

console.log("Auth routes loaded");

router.post("/login", login);
router.post("/register", register);

export default router;
