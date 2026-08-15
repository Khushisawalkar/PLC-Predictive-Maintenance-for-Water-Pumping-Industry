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

let inMemoryHistory = [];

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected successfully!"))
    .catch(err => console.error("MongoDB Connection Error:", err));
} else {
  console.log("No MONGO_URI found, using in-memory storage.");
  try {
    const rawData = fs.readFileSync('history.json', 'utf8');
    inMemoryHistory = JSON.parse(rawData);
    console.log("Loaded " + inMemoryHistory.length + " records from history.json into memory.");
  } catch(e) {
    console.log("Could not load history.json into memory:", e.message);
  }
}

app.post("/api/temperature", async (req, res) => {
  try {
    const { temperature, speed, vibration, current } = req.body;
    
    if (process.env.MONGO_URI) {
      const newData = new Temperature({ temperature, speed, vibration, current });
      await newData.save();
    } else {
      inMemoryHistory.push({
        temperature, speed, vibration, current,
        createdAt: new Date().toISOString()
      });
      if (inMemoryHistory.length > 1000) inMemoryHistory.shift();
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false });
  }
});


app.get("/api/latest", async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const latest = await Temperature.findOne().sort({ createdAt: -1 });
      res.json(latest || {});
    } else {
      res.json(inMemoryHistory.length > 0 ? inMemoryHistory[inMemoryHistory.length - 1] : {});
    }
  } catch (error) {
    res.status(500).json({});
  }
});

app.get("/api/history", async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const history = await Temperature.find().sort({ createdAt: -1 }).limit(1000);
      res.json(history.length > 0 ? history.reverse() : []);
    } else {
      res.json(inMemoryHistory);
    }
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});