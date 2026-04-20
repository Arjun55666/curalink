const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "mysecretkey";
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://kqbieknaykuaacnxlohv.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_KEY || "sb_publishable_K7ey80T_WeDif1I7LcKxNQ_v4x8mUSB";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "CuraLink backend is running" });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword }]);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: "User registered" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
