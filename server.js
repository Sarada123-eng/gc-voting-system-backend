const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");
const voteRoutes = require("./routes/vote");


const app = express();
PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GC Voting Backend Running");
});


app.use("/api/auth", authRoutes);
app.use("/api", voteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
