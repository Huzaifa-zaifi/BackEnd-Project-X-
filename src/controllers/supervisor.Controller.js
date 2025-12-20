import mongoose from "mongoose";
import observationModal from "../models/observation.modal.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * 1️⃣ Supervisor Home Dashboard
 */
export const supervisorDashboard = async (req, res) => {
  try {
    const submitted = await observationModal.countDocuments({ status: "Submitted" });
    const inReview = await observationModal.countDocuments({ status: "In Review" });
    const closed = await observationModal.countDocuments({ status: "Closed" });

    const categorySummary = await observationModal.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({ submitted, inReview, closed, categorySummary });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
  }
};

/**
 * 2️⃣ Get Observations for Review
 */
export const getSubmittedObservations = async (req, res) => {
  try {
    const observations = await observationModal.find({ status: "Submitted" })
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(observations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch observations", error: err.message });
  }
};

/**
 * 3️⃣ Review Observation (Supervisor)
 * Actions: IN_REVIEW | CLOSE | REJECT
 */
export const reviewObservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid observation ID" });

    let status;
    if (action === "IN_REVIEW") status = "In Review";
    if (action === "CLOSE") status = "Closed";
    if (action === "REJECT") status = "Rejected";

    const observation = await observationModal.findByIdAndUpdate(
      id,
      { status, supervisorComment: comment, reviewedBy: req.user._id, reviewedAt: Date.now() },
      { new: true }
    ).populate("employee assignedTo reviewedBy", "name email");

    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.status(200).json(observation);
  } catch (err) {
    res.status(500).json({ message: "Failed to review observation", error: err.message });
  }
};

/**
 * 4️⃣ Supervisor Analytics
 */
export const supervisorAnalytics = async (req, res) => {
  try {
    const totalReviewed = await observationModal.countDocuments({ reviewedBy: req.user._id });
    const closedCount = await observationModal.countDocuments({ reviewedBy: req.user._id, status: "Closed" });

    res.status(200).json({
      totalReviewed,
      closedCount,
      closureRate: totalReviewed ? ((closedCount / totalReviewed) * 100).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};

// supervisor.Controller.js
export const getAllObservationsForTracking = async (req, res) => {
  try {
    const observations = await observationModal.find()
      .populate("employee assignedTo reviewedBy", "name email")
      .sort({ createdAt: -1 });

    // Optionally, you can group by status for graphing
    const summary = await observationModal.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({ observations, summary });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tracking data", error: err.message });
  }
};


/**
 * 5️⃣ Optional: Employee CRUD for Supervisor (if needed)
 * You can reuse your existing employee observationController functions
 * with `observationModal` import.
 */
