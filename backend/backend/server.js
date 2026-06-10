const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");

const Temperature = require("./models/Temperature");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let latestData = { temperature: 25.0, speed: 0, vibration: 0, createdAt: new Date() };

let inMemoryHistory = [];
const HISTORY_FILE = "./history.json";

// Try to load history from disk if MongoDB is offline and the server restarted
if (fs.existsSync(HISTORY_FILE)) {
  try {
    const rawData = fs.readFileSync(HISTORY_FILE);
    inMemoryHistory = JSON.parse(rawData);
    if (inMemoryHistory.length > 0) {
      latestData = inMemoryHistory[inMemoryHistory.length - 1];
    }
  } catch (err) {
    console.error("Error reading history file:", err);
  }
}

app.post("/api/temperature", async (req, res) => {

  try {

    const { temperature, speed, vibration } = req.body;

    console.log("Data Received - Temp:", temperature, "Speed:", speed, "Vibration:", vibration);

    if (temperature !== undefined) latestData.temperature = temperature;
    if (speed !== undefined) latestData.speed = speed;
    if (vibration !== undefined) latestData.vibration = vibration;
    latestData.createdAt = new Date();

    const newData = new Temperature({
      temperature,
      speed
    });

    inMemoryHistory.push({ ...latestData });
    if (inMemoryHistory.length > 100) inMemoryHistory.shift();
    
    // Save to local file as a backup in case MongoDB is down
    fs.writeFile(HISTORY_FILE, JSON.stringify(inMemoryHistory), (err) => {
      if (err) console.error("Error writing to history file:", err);
    });

    // Try to save to DB, but don't fail if DB is unavailable
    await newData.save().catch(err => console.error("Mongo Save Error:", err.message));

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });

  }
});


app.get("/api/latest", async (req, res) => {
  try {
    const data = await Temperature
      .findOne()
      .sort({ createdAt: -1 })
      .catch(() => null);

    res.json(data || latestData);
  } catch (error) {
    res.json(latestData);
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const data = await Temperature.find().sort({ createdAt: -1 }).limit(100);
    if (data && data.length > 0) {
      return res.json(data.reverse());
    }
    res.json(inMemoryHistory);
  } catch (error) {
    res.json(inMemoryHistory);
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