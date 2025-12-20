import Report from "../../models/report.model.js";

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report
      .find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    if (reports.length === 0) {
      return res.status(200).json({ message: "No reports found", reports: [] });
    }

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// Update report status
export const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, remarks: req.body.remarks },
      { new: true }
    ).populate("employee", "name email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update report" });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete report" });
  }
};
