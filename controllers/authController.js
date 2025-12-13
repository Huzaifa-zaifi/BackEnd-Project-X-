import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  console.log("Login controller reached");

  try {
    const { email, password } = req.body;

    // 1. Validate input early
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Fetch only required fields
    const result = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 3. Ensure stored password exists
    if (!user.password) {
      return res.status(500).json({ message: "User password not set" });
    }

    // 4. Correct bcrypt comparison
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Success response
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
      [email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
