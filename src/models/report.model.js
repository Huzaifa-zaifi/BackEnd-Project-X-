import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    remarks: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
