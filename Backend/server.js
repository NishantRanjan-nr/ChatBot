// Importing Libraries
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import mongoose from "mongoose";
import chatRoutes from './routes/chat.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, ".env") });

// App and Port
const app = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    try {
        const parsedOrigin = new URL(origin);
        return parsedOrigin.hostname.endsWith(".vercel.app");
    } catch {
        return false;
    }
};

app.set("trust proxy", 1);

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Routes
app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);


// Connecting Mongodb
const connectDb = async() => {
    try{
        console.log("Attempting to connect to MongoDB...");
        await Promise.race([
            mongoose.connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 5000 }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("MongoDB connection timeout")), 5000))
        ]);
        console.log("Connected with database");
    } catch(err){
        console.log(`Failed to connect to database - ${err.message}`);
        console.log("Continuing without database connection...");
    }
}


// Main Running App
const startServer = async() => {
    await connectDb();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

startServer();