const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  medicUid: { type: String, required: true },
  patientUid: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
