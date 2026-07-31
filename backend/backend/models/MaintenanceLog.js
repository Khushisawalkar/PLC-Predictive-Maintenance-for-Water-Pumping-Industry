const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['PREVENTIVE', 'CORRECTIVE', 'CALIBRATION'], required: true },
  description: { type: String, required: true },
  performedBy: { type: String, required: true },
  runningHoursAtService: { type: Number },
  partsReplaced: [{ type: String }],
  nextServiceDueDate: { type: Date },
  cost: { type: Number, default: 0 }
});

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);
