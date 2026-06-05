import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
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

export default app;
