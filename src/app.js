import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
const allowedOrigins = ["http://localhost:5173", "*"];

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true); // allow all
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// routes
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

app.use("/signflow/user", userRoutes);
app.use("/signflow/document", documentRoutes);

export default app;
