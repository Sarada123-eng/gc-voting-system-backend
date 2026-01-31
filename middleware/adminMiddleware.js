const prisma = require("../prismaClient");

const ADMIN_EMAILS = [
  "admin@iitbbs.ac.in",
  "webnd@iitbbs.ac.in"
];

module.exports = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.studentId }
    });

    if (!student || !ADMIN_EMAILS.includes(student.email)) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Admin auth failed" });
  }
};
