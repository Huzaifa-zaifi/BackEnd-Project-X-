import express from "express";
import { 
  createObservation, 
  deleteObservation, 
  getMyObservations, 
  getObservationById, 
  updateObservation 
} from "../controllers/observation.Controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Base URL: /api/observations
router.post("/", authenticate, createObservation);
router.get("/", authenticate, getMyObservations);
router.get("/:id", authenticate, getObservationById);
router.put("/:id", authenticate, updateObservation);
router.delete("/:id", authenticate, deleteObservation);

export { router as observationRouter };
