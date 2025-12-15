import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    phoneNumber: {
      type: String,
      trim: true,
      index: true
    },

    role: {
      type: [String],
      enum: ["user", "admin", "moderator"],
      default: ["user"]
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default model("User", userSchema);