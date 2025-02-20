const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  ban: { type: Boolean, required: true },
  birthdate: { type: String, required: true },
  gender: { type: String, required: true },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
