import mongoose from "mongoose";
import observationModal from "../models/observation.modal.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateCreatePayload = (body) => {
  const { type, category, description, location, riskLevel } = body;
  if (!type || !category || !description || !location || !riskLevel) {
    return "Missing required fields";
  }
  return null;
};

// CREATE observation (Employee)
export const createObservation = async (req, res) => {
  try {
    const error = validateCreatePayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const observation = await observationModal.create({
      employee: req.user._id,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      riskLevel: req.body.riskLevel,
      priority: req.body.priority || "Low",
      draftStatus: true,
      status: "Draft",
      imageUrl: req.body.imageUrl || undefined,
    });

    res.status(201).json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to create observation", error: err.message });
  }
};

// GET all my observations (Employee)
export const getMyObservations = async (req, res) => {
  try {
    const observations = await observationModal.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo reviewedBy", "name email");
    res.json(observations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch observations", error: err.message });
  }
};

// GET observation by ID (Employee)
export const getObservationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) 
      return res.status(400).json({ message: "Invalid observation ID" });

    const observation = await observationModal.findOne({ _id: req.params.id, employee: req.user._id })
      .populate("assignedTo reviewedBy", "name email");

    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch observation", error: err.message });
  }
};

// UPDATE observation (Employee can update own observations)
export const updateObservation = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) 
      return res.status(400).json({ message: "Invalid observation ID" });

    const observation = await observationModal.findOne({ _id: req.params.id, employee: req.user._id });
    if (!observation) return res.status(404).json({ message: "Observation not found" });

    const fields = ["type", "category", "description", "location", "riskLevel", "priority", "imageUrl"];
    fields.forEach(field => {
      if (req.body[field] !== undefined) observation[field] = req.body[field];
    });

    if (req.body.submit === true) {
      observation.status = "Submitted";
      observation.draftStatus = false;
    }

    await observation.save();
    res.json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to update observation", error: err.message });
  }
};

// DELETE observation (Employee can delete own observations)
export const deleteObservation = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) 
      return res.status(400).json({ message: "Invalid observation ID" });

    const observation = await observationModal.findOneAndDelete({ _id: req.params.id, employee: req.user._id });
    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.json({ message: "Observation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete observation", error: err.message });
  }
};

// GET all observations (Admin)
export const getAllObservations = async (req, res) => {
  try {
    const observations = await observationModal.find()
      .populate("employee assignedTo reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(observations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch observations", error: err.message });
  }
};

// UPDATE observation status (Admin)
export const updateObservationStatus = async (req, res) => {
  try {
    const observation = await observationModal.findById(req.params.id);
    if (!observation) return res.status(404).json({ message: "Observation not found" });

    observation.status = req.body.status;

    if (["Approved", "Rejected"].includes(req.body.status)) {
      observation.reviewedBy = req.user._id;
      observation.reviewedAt = Date.now();
    }

    await observation.save();
    res.json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to update observation", error: err.message });
  }
};

// ASSIGN observation to user (Admin)
export const assignObservation = async (req, res) => {
  try {
    const observation = await observationModal.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign observation", error: err.message });
  }
};
