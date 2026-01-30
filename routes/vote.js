const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/coordinators", authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.studentId }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const coordinators = await prisma.coordinator.findMany({
      where: { branch: student.branch },
      include: {
        _count: {
          select: { votes: true }
        }
      }
    });

    res.json(coordinators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch coordinators" });
  }
});

router.post("/vote/:coordinatorId", authMiddleware, async (req, res) => {
  const coordinatorId = parseInt(req.params.coordinatorId);

  try {
    await prisma.$transaction(async (tx) => {

      const student = await tx.student.findUnique({
        where: { id: req.studentId }
      });

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      if (student.hasVoted) {
        throw new Error("ALREADY_VOTED");
      }

      const coordinator = await tx.coordinator.findUnique({
        where: { id: coordinatorId }
      });

      if (!coordinator) {
        throw new Error("COORDINATOR_NOT_FOUND");
      }

      if (coordinator.branch !== student.branch) {
        throw new Error("INVALID_BRANCH");
      }

      await tx.vote.create({
        data: {
          studentId: student.id,
          coordinatorId
        }
      });

      await tx.student.update({
        where: { id: student.id },
        data: { hasVoted: true }
      });
    });

    res.json({ message: "Vote cast successfully" });

  } catch (err) {
    if (err.message === "ALREADY_VOTED") {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (err.message === "INVALID_BRANCH") {
      return res.status(403).json({ message: "Invalid vote attempt" });
    }

    if (err.message === "STUDENT_NOT_FOUND") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (err.message === "COORDINATOR_NOT_FOUND") {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    console.error(err);
    res.status(500).json({
      message: "Voting failed",
      status: err.message
    });
  }
});

module.exports = router;
