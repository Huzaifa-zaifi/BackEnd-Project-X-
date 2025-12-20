import Observation from "../../models/observation.modal.js";
import Report from "../../models/report.model.js";
import User from "../../models/user.model.js";

export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalObservations = await Observation.countDocuments();
  const totalReports = await Report.countDocuments();

  const observationStatus = await Observation.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const monthlyObservations = await Observation.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    totalUsers,
    totalObservations,
    totalReports,
    observationStatus,
    monthlyObservations
  });
};
