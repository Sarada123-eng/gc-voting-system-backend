const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/* ---------------- ADD COORDINATOR ---------------- */
router.post(
  "/coordinator",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { name, branch, photo } = req.body;

    if (!name || !branch) {
      return res.status(400).json({ message: "Name & branch required" });
    }

    const coordinator = await prisma.coordinator.create({
      data: { name, branch, photo }
    });

    res.json({ message: "Coordinator added", coordinator });
  }
);

/* ---------------- LIST COORDINATORS (FILTER) ---------------- */
router.get(
  "/coordinators",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { branch } = req.query;

    const coordinators = await prisma.coordinator.findMany({
      where: branch ? { branch } : {},
      include: {
        _count: { select: { votes: true } }
      }
    });

    res.json(coordinators);
  }
);

module.exports = router;
