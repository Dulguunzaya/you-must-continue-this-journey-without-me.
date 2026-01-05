const express = require("express");
const session = require("express-session");
import cors from "cors";
const connectDB = require("./backend/db");
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

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
