import express from "express";
import "dotenv/config"
import authRoutes from "./routes/auth.routes.js"

const app = express();
const port = process.env.PORT || 4000;

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log('server running', port);
});