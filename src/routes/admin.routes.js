import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeAdmin } from "../middleware/roleMiddleware.js";

import { 
  getAllUsers,
  createUser,
  updateUser,
  changeUserStatus,
  softDeleteUser,
  getAllEmployees
} from "../controllers/Admin/adminUserController.js";

import {
  getAllObservations,
  updateObservationStatus,
  assignObservation,
  deleteObservation
} from "../controllers/Admin/adminObservationController.js";

import {
  getAllReports,
  updateReportStatus,
  deleteReport
} from "../controllers/Admin/adminReportController.js";

import { getAdminStats } from "../controllers/Admin/adminStatsController.js";

const router = express.Router();

// GLOBAL ADMIN PROTECTION
router.use(authenticate, authorizeAdmin);

// Users
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/status", changeUserStatus);
router.delete("/users/:id", softDeleteUser);
router.get("/employees", getAllEmployees); // Fixed, no duplicate middleware

// Observations
router.get("/observations", getAllObservations);
router.patch("/observations/:id/status", updateObservationStatus);
router.patch("/observations/:id/assign", assignObservation);
router.delete("/observations/:id", deleteObservation);

// Reports
router.get("/reports", getAllReports);
router.patch("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

// Dashboard
router.get("/stats", getAdminStats);

export default router;
