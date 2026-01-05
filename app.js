import express from "express";
import session from "express-session";
import cors from "cors";
import connectDB from "./backend/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

connectDB();


app.use(cors());

app.use(express.json());

app.use(
  session({
    secret: "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
