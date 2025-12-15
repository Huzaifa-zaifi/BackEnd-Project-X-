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

    imageUrl: { type: String },

    status: {
      type: String,
      enum: ["Submitted", "In Review", "Closed"],
      default: "Submitted"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Observation", observationSchema);
