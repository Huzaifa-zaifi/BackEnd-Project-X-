import observationModel from "../models/observation.model.js";


/**
 * 4.1 Supervisor Home Dashboard
 */
export const supervisorDashboard = async (req, res) => {
  try {
    const submitted = await observationModel.countDocuments({ status: "Submitted" });
    const inReview = await observationModel.countDocuments({ status: "In Review" });
    const closed = await observationModel.countDocuments({ status: "Closed" });

    const categorySummary = await observationModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      submitted,
      inReview,
      closed,
      categorySummary
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 4.2 Get Observations for Review
 */
export const getSubmittedObservations = async (req, res) => {
  const observations = await observationModel.find({ status: "Submitted" })
    .populate("employee", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(observations);
};

/**
 * 4.2 Review Observation
 * Actions: IN_REVIEW | CLOSE | REJECT
 */
export const reviewObservation = async (req, res) => {
  const { id } = req.params;
  const { action, comment } = req.body;

  let status;

  if (action === "IN_REVIEW") status = "In Review";
  if (action === "CLOSE") status = "Closed";

  const observation = await observationModel.findByIdAndUpdate(
    id,
    {
      status,
      supervisorComment: comment,
      reviewedBy: req.user._id
    },
    { new: true }
  );

  res.status(200).json(observation);
};

/**
 * 4.5 Supervisor Analytics
 */
export const supervisorAnalytics = async (req, res) => {
  const totalReviewed = await observationModel.countDocuments({
    reviewedBy: req.user._id
  });

  const closedCount = await observationModel.countDocuments({
    reviewedBy: req.user._id,
    status: "Closed"
  });

  res.status(200).json({
    totalReviewed,
    closedCount,
    closureRate: totalReviewed
      ? ((closedCount / totalReviewed) * 100).toFixed(2)
      : 0
  });
};
