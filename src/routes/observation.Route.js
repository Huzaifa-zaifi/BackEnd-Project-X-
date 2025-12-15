import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createObservation,
  getMyObservations,
  getObservationById,
  updateObservation,
  deleteObservation
} from "../controllers/observation.controller.js";

const router = express.Router();

router.post("/", auth, createObservation);
router.get("/", auth, getMyObservations);
router.get("/:id", auth, getObservationById);
router.put("/:id", auth, updateObservation);
router.delete("/:id", auth, deleteObservation);

export default router;
