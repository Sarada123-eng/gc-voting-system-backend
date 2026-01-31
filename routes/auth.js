const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ---------- SIGNUP ----------
router.post("/signup", async (req, res) => {
  const { email, password, branch } = req.body;

  if (!email || !password || !branch) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailLower = email.toLowerCase();

  if (!emailLower.endsWith("@iitbbs.ac.in")) {
    return res.status(400).json({
      message: "Email must be an IIT Bhubaneswar email ID",
    });
  }

  try {
    const existing = await prisma.student.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.student.create({
      data: {
        email: emailLower,
        password: hashedPassword,
        branch,
      },
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ---------- GOOGLE LOGIN ----------
router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token missing" });
  }

  try {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    // Restrict to IIT BBS domain
    if (!email.endsWith("@iitbbs.ac.in")) {
      return res.status(403).json({
        message: "Only IIT Bhubaneswar Google accounts allowed",
      });
    }

    let student = await prisma.student.findUnique({
      where: { email },
    });

    // Auto-create account on first Google login
    if (!student) {
      student = await prisma.student.create({
        data: {
          email,
          password: "google-auth", // dummy value, never used
          branch: "UNKNOWN",
        },
      });
    }

    const jwtToken = jwt.sign(
      { id: student.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google login failed" });
  }
});

module.exports = router;
