const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const voteRoutes = require("./routes/vote");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true, 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GC Voting Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", voteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
