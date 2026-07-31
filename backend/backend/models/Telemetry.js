const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  
  // Analog Sensors
  temperature: { type: Number, required: true }, // Motor Temp
  bearingTemperature: { type: Number, default: 0 },
  vibration: { type: Number, required: true }, // mm/s
  current: { type: Number, required: true }, // Amps
  voltage: { type: Number, required: true }, // Volts
  pressure: { type: Number, required: true }, // Bar
  flowRate: { type: Number, required: true }, // L/min
  rpm: { type: Number, required: true },
  waterLevel: { type: Number, required: true }, // %
  oilQuality: { type: Number, required: true }, // %

  // Digital Status
  motorStatus: { type: Boolean, default: false }, // true=Running
  plcStatus: { type: Boolean, default: true },

  // Calculated Metrics
  mechanicalHealth: { type: Number, default: 100 },
  electricalHealth: { type: Number, default: 100 },
  hydraulicHealth: { type: Number, default: 100 },
  overallHealth: { type: Number, default: 100 },
  pumpEfficiency: { type: Number, default: 0 },
  powerConsumption: { type: Number, default: 0 } // kW
});

// Create a compound index for fast time-series queries
telemetrySchema.index({ timestamp: -1 });

module.exports = mongoose.model("Telemetry", telemetrySchema);
