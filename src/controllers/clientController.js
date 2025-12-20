
import observationModel from "../models/observation.model.js";

/**
 * 6.1 Client Dashboard Home
 */
export const clientDashboard = async (req, res) => {
  try {
    const total = await observationModel.countDocuments();

    const submitted = await observationModel.countDocuments({ status: "Submitted" });
    const inReview = await observationModel.countDocuments({ status: "In Review" });
    const closed = await observationModel.countDocuments({ status: "Closed" });

    res.status(200).json({
      totalObservations: total,
      statusBreakdown: {
        submitted,
        inReview,
        closed
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 6.2 View All Observations (Read-Only)
 */
export const getAllObservations = async (req, res) => {
  const {
    status,
    category,
    riskLevel,
    startDate,
    endDate
  } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (riskLevel) filter.riskLevel = riskLevel;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const observations = await observationModel.find(filter)
    .populate("employee", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(observations);
};

/**
 * 6.2 Single Observation Detail (Read-Only)
 */
export const getObservationById = async (req, res) => {
  const observation = await observationModel.findById(req.params.id)
    .populate("employee", "name email")
    .populate("reviewedBy", "name");

  if (!observation) {
    return res.status(404).json({ message: "Observation not found" });
  }

  res.status(200).json(observation);
};

/**
 * 6.3 Weekly / Monthly Summary Reports
 */
export const clientSummaryReport = async (req, res) => {
  const { period } = req.query; // weekly | monthly

  const days = period === "monthly" ? 30 : 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const total = await Observation.countDocuments({
    createdAt: { $gte: fromDate }
  });

  const closed = await Observation.countDocuments({
    createdAt: { $gte: fromDate },
    status: "Closed"
  });

  const highRisk = await Observation.countDocuments({
    createdAt: { $gte: fromDate },
    riskLevel: "High"
  });

  const categoryBreakdown = await observationModel.aggregate([
    { $match: { createdAt: { $gte: fromDate } } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    period,
    total,
    closed,
    highRisk,
    categoryBreakdown
  });
};

/**
 * 6.4 Graphs & Insights
 */
export const clientAnalytics = async (req, res) => {
  const statusTrend = await observationModel.aggregate([
    {
      $group: {
        _id: {
          status: "$status",
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const riskDistribution = await Observation.aggregate([
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
  ]);

  const topLocations = await Observation.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({
    statusTrend,
    riskDistribution,
    topLocations
  });
};
