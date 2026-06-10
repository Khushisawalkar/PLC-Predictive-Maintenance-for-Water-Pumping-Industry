const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Temperature = require("./models/Temperature");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let latestData = { temperature: 25.0, speed: 0, vibration: 0, createdAt: new Date() };

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