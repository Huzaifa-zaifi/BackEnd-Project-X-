import User from "../../models/user.model.js";

// Get all users (admins + employees)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Change user status
export const changeUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Soft delete user
export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: { $in: ["user", "employee"] },
      isDeleted: false
    }).select("-password");

    if (employees.length === 0) {
      return res.status(200).json({ message: "No employees found", employees: [] });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
