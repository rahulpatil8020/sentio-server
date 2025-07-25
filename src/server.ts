import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", routes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Catch-all for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: "NotFoundError",
      message: "Route not found",
    },
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Sentio backend running at http://localhost:${PORT}`);
});
