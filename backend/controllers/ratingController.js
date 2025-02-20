const mongoose = require("mongoose");
const Rating = require("../models/rating");

exports.createRating = async (req, res) => {
  const { medicUid, patientUid, rating } = req.body;
  const ratingg = new Rating({
    _id: new mongoose.Types.ObjectId(),
    medicUid,
    patientUid,
    rating,
  });

  ratingg
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created rating successfully",
        createdRating: {
          _id: result._id,
          medicUid: result.medicUid,
          patientUid: result.patientUid,
          rating: result.rating,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getRatings = async (req, res) => {
  const id = req.params.id;
  Rating.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getRating = async (req, res) => {
  const id = req.params.id;
  Rating.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.updateRating = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Rating.updateOne({ _id: id }, req.body);

    if (result.n === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({
      message: "Rating updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.deleteRating = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Rating.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({
      message: "Rating deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
