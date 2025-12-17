import dotenv from "dotenv"
dotenv.config({ path: "./.env" }); 
import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { authRouter } from "./src/routes/authRoutes.js";
import { employeeRouter } from "./src/routes/employeeRoutes.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
connectDB();

// Mount auth routes
app.use("/api/auth", authRouter);

app.use("/api/employee", employeeRouter);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
