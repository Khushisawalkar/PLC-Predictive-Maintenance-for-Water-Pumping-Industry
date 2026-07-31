const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  temperature: Number,
  speed: Number,
  vibration: Number,
  current: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
);