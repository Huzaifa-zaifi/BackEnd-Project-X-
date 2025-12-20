import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { authRouter } from "./src/routes/authRoutes.js";
import { observationRouter } from "./src/routes/Observation.Route.js";
import { employeeRouter } from "./src/routes/employeeRoutes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { supervisorRouter } from "./src/routes/supervisorRoute.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRouter);              // Login/Register
app.use("/api/observations", observationRouter); // CRUD observations
app.use("/api/employee", employeeRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/supervisor", supervisorRouter);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
