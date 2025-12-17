import Report from "../models/report.model.js"

// Submit a report
export const createReport = async (req, res) => {
  try {
    const { title, description } = req.body;
    const report = await Report.create({
      employee: req.user.id,
      title,
      description
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report
    });
  } catch (err) {
    console.error("Create report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get employee's own reports
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ employee: req.user.id });
    res.json(reports);
  } catch (err) {
    console.error("Get reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
