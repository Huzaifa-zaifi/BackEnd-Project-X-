// routes/supervisor.routes.js
import express from "express";
import {
  supervisorDashboard,
  getSubmittedObservations,
  reviewObservation,
  supervisorAnalytics
} from "../controllers/supervisor.Controller.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, supervisorDashboard);

router.get(
  "/observations/submitted",
 authenticate,
  getSubmittedObservations
);

router.patch(
  "/observations/:id/review",
  authenticate,
  reviewObservation
);

router.get(
  "/analytics",
  authenticate,
  supervisorAnalytics
);

export {router as supervisorRouter };
