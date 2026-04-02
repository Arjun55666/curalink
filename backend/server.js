const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// CONNECT SUPABASE (USE SERVICE ROLE KEY)
const supabase = createClient(
  "https://kqbieknaykuaacnxlohv.supabase.co",
  "sb_publishable_K7ey80T_WeDif1I7LcKxNQ_v4x8mUSB"
);

// REGISTER USER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }]);

  if (error) return res.status(500).json(error);

  res.json({ message: "User registered" });
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔍 Find user in DB
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(401).json({ message: "User not found" });
  }

  //  Compare password
  const isMatch = await bcrypt.compare(password, data.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  //  Generate JWT
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

app.listen(5000, () => console.log("Server running on 5000"));