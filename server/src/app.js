import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get("/", (req, res) => res.send("server is running"));

export default app