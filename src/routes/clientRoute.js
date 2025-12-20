import express from "express";
import {
  clientDashboard,
  getAllObservations,
  getObservationById,
  clientSummaryReport,
  clientAnalytics
} from "../controllers/clientController.js";
import { authenticate } from "../middleware/authMiddleware.js";


const router = express.Router();

/* Dashboard */
router.get(
  "/dashboard",
  authenticate,
  clientDashboard
);

/* Observations */
router.get(
  "/observations",
  authenticate,
  getAllObservations
);

router.get(
  "/observations/:id",
  authenticate,
  getObservationById
);

/* Reports */
router.get(
  "/reports/summary",
  authenticate,
  clientSummaryReport
);

/* Analytics */
router.get(
  "/analytics",
  authenticate,
  clientAnalytics
);

export {router as clientRouter };
