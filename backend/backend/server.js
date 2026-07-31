const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");

const Temperature = require("./models/Temperature");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected successfully!"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use(cors());
app.use(express.json());

app.post("/api/temperature", async (req, res) => {
  try {
    const { temperature, speed, vibration, current } = req.body;
    console.log("Data Received - Temp:", temperature, "Speed:", speed, "Vibration:", vibration, "Current:", current);

    const newData = new Temperature({
      temperature,
      speed,
      vibration,
      current
    });

    await newData.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false });
  }
});


app.get("/api/latest", async (req, res) => {
  try {
    const latest = await Temperature.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (error) {
    res.status(500).json({});
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await Temperature.find().sort({ createdAt: -1 }).limit(1000);
    res.json(history.length > 0 ? history.reverse() : []);
  } catch (error) {
    res.status(500).json([]);
  }
});


let latestCommand = "none";

app.post("/api/command", (req, res) => {

  const { command } = req.body;

  console.log("Command Received:", command);

  latestCommand = command;

  res.json({
    success: true,
    command
  });

});

app.get("/api/command", (req, res) => {
  res.json({ command: latestCommand });
  // Clear it after reading so the ESP doesn't trigger the same command repeatedly
  latestCommand = "none";
});
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});