import mongoose from "mongoose";

const observationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["Unsafe Act", "Unsafe Condition"],
      required: true
    },

    category: {
      type: String,
      enum: ["PPE", "Tools", "Housekeeping", "Chemical", "Electrical"],
      required: true
    },

    description: { type: String, required: true },

    location: { type: String, required: true },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low"
    },

    imageUrl: { type: String },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "In Review", "Approved", "Rejected", "Closed"],
      default: "Draft"
    },

    draftStatus: { type: Boolean, default: true },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    reviewedAt: { type: Date },

    supervisorComment: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Observation", observationSchema);
