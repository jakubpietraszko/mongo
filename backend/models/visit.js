const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  endTime: { type: String, required: true },
  medicUid: { type: String, required: true },
  paid: { type: Boolean, required: true },
  patientUid: { type: String, required: true },
  startTime: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
});

const Visit = mongoose.model("Visit", VisitSchema);

module.exports = Visit;