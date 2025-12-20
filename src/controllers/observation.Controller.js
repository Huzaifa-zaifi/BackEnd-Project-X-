import mongoose from "mongoose";
import observationModel from "../models/observation.model";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateCreatePayload = (body) => {
  const { type, category, description } = body;
  if (!type || !category || !description) {
    return "Missing required fields";
  }
  return null;
};

export const createObservation = async (req, res) => {
  try {
    const error = validateCreatePayload(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const observation = await observationModel.create({
      employee: req.user._id,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      riskLevel: req.body.riskLevel,
      draftStatus: req.body.draftStatus || false,
    });

    res.status(201).json(observation);
  } catch (error) {
    res.status(500).json({ message: "Failed to create observation", error: error.message });
  }
};

export const getMyObservations = async (req, res) => {
  try {
    const observations = await observationModel.find({
      employee: req.user._id
    }).sort({ createdAt: -1 });

    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch observations", error: error.message });
  }
};

export const getObservationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid observation ID" });
    }

    const observation = await observationModel.findOne({
      _id: req.params.id,
      employee: req.user._id
    });

    if (!observation) {
      return res.status(404).json({ message: "Observation not found" });
    }

    res.json(observation);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch observation", error: error.message });
  }
};

export const updateObservation = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid observation ID" });
    }

    const updateData = {
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      riskLevel: req.body.riskLevel
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const observation = await observationModel.findOneAndUpdate(
      {
        _id: req.params.id,
        employee: req.user._id
      },
      updateData,
      { new: true }
    );

    if (!observation) {
      return res.status(404).json({ message: "Observation not found" });
    }

    res.json(observation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update observation", error: error.message });
  }
};

export const deleteObservation = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid observation ID" });
    }

    const observation = await observationModel.findOneAndDelete({
      _id: req.params.id,
      employee: req.user._id
    });

    if (!observation) {
      return res.status(404).json({ message: "Observation not found" });
    }

    res.json({ message: "Observation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete observation", error: error.message });
  }
};
