const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ['WARNING', 'ALARM', 'CRITICAL', 'EMERGENCY'], required: true },
  parameter: { type: String, required: true }, // e.g., 'Temperature', 'Vibration', 'DryRun'
  value: { type: Number },
  threshold: { type: Number },
  message: { type: String, required: true },
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: String },
  acknowledgedAt: { type: Date },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model("Alarm", alarmSchema);
