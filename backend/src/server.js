import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the server", error);
    process.exit(1);
  }
};

startServer();