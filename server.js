const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const voteRoutes = require("./routes/vote");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gc-voting.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GC Voting Backend Running");
});


app.use("/api/auth", authRoutes);
app.use("/api", voteRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
