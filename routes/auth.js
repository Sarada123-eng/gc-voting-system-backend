const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ADMIN_EMAILS = [
  "admin@iitbbs.ac.in",
  "webnd@iitbbs.ac.in",
  "gcadmin@iitbbs.ac.in",
  "24ce01084@iitbbs.ac.in"
];


/* ---------------- GOOGLE LOGIN ---------------- */
router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email.endsWith("@iitbbs.ac.in")) {
      return res.status(403).json({
        message: "Only IIT Bhubaneswar email allowed",
      });
    }

    const isAdmin = ADMIN_EMAILS.includes(email);

    let student = await prisma.student.findUnique({
      where: { email },
    });

    // If first-time Google login → auto-create user
    if (!student && !isAdmin) {
      student = await prisma.student.create({
        data: {
          email,
          password: "GOOGLE_AUTH", // dummy value, never used
          branch: "Unknown",       // you can update later if needed
        },
      });
    }

    const jwtToken = jwt.sign(
      {
        id:student?.id || null,
        email,
        role: isAdmin ? "admin" : "student"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  token: jwtToken,
  branch: student ? student.branch : null,
  role: isAdmin ? "admin" : "student"
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

router.post("/set-branch", authMiddleware, async (req, res) => {
  const { branch } = req.body;

  if (!branch) {
    return res.status(400).json({ message: "Branch is required" });
  }

  try {
    await prisma.student.update({
      where: { id: req.studentId },
      data: { branch },
    });

    res.json({ message: "Branch updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set branch" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.studentId },
      select: {
        branch: true,
        hasVoted: true,
      },
    });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* --------- KEEP OLD ROUTES (NO BREAKAGE) --------- */
router.post("/signup", async (req, res) => {
  const { email, password, branch } = req.body;

  if (!email || !password || !branch) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email.toLowerCase().endsWith("@iitbbs.ac.in")) {
    return res.status(400).json({
      message: "Email must be an IIT Bhubaneswar email ID",
    });
  }

  try {
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.student.create({
      data: { email, password: hashedPassword, branch },
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await prisma.student.findUnique({ where: { email } });
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
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
