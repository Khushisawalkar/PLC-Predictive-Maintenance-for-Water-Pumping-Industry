const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  temperature: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
);