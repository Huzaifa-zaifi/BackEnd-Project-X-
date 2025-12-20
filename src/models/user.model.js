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
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    phoneNumber: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: ["user", "supervisor", "admin"],
      default: "user"
    },

    department: {
      type: String,
      default: "General"
    },

    designation: {
      type: String,
      default: "Employee"
    },

    profileImage: {
      type: String
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

    isDeleted: {
      type: Boolean,
      default: false
    },

    lastLoginAt: Date
  },
  {
    timestamps: true
  }
);

// prevent duplicate index crash
userSchema.index({ email: 1 });

export default model("User", userSchema);
