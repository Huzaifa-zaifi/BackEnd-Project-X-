import express from "express";
// import { authenticate } from "../middleware/authMiddleware.js"
import {authenticate} from "../middleware/authMiddleware.js"
import { createReport, getMyReports } from "../controllers/employeeController.js";

const router = express.Router();

// Employee Dashboard (basic info)
router.get("/dashboard", authenticate, (req, res) => {
  res.json({
    message: "Employee dashboard data",
    user: req.user
  });
});

// Create a new report
router.post("/report", authenticate, createReport);

// Get all reports by logged-in employee
router.get("/reports", authenticate, getMyReports);

export { router as employeeRouter };
