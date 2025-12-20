import Observation from "../../models/observation.modal.js"; // Correct import

// Get all observations
export const getAllObservations = async (req, res) => {
  try {
    const observations = await Observation
      .find()
      .populate("employee", "name email")
      .populate("assignedTo", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    if (observations.length === 0) {
      return res.status(200).json({ message: "No observations found", observations: [] });
    }

    res.status(200).json(observations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch observations" });
  }
};

// Update observation status
export const updateObservationStatus = async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id);

    if (!observation) return res.status(404).json({ message: "Observation not found" });

    observation.status = req.body.status;

    if (["Approved", "Rejected"].includes(req.body.status)) {
      observation.reviewedBy = req.user._id;
      observation.reviewedAt = Date.now();
    }

    await observation.save();

    // Populate referenced users
    await observation
      .populate("employee", "name email")
      .populate("assignedTo", "name email")
      .populate("reviewedBy", "name email");

    res.status(200).json(observation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update observation" });
  }
};


// Assign observation to a user
export const assignObservation = async (req, res) => {
  try {
    const observation = await Observation.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.status(200).json(observation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign observation" });
  }
};

// Delete observation
export const deleteObservation = async (req, res) => {
  try {
    const observation = await Observation.findByIdAndDelete(req.params.id);
    if (!observation) return res.status(404).json({ message: "Observation not found" });

    res.status(200).json({ message: "Observation deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete observation" });
  }
};
