const mongoose = require("mongoose");
const Visit = require("../models/visit");

exports.createVisit = async (req, res) => {
  const {
    date,
    description,
    endTime,
    medicUid,
    paid,
    patientUid,
    startTime,
    status,
    type,
  } = req.body;

  const visit = new Visit({
    _id: new mongoose.Types.ObjectId(),
    date,
    description,
    endTime,
    medicUid,
    paid,
    patientUid,
    startTime,
    status,
    type,
  });

  visit
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created visit successfully",
        createdVisit: {
          _id: result._id,
          date: result.date,
          description: result.description,
          endTime: result.endTime,
          medicUid: result.medicUid,
          paid: result.paid,
          patientUid: result.patientUid,
          startTime: result.startTime,
          status: result.status,
          type: result.type,
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

exports.getVisits = async (req, res) => {
  Visit.find()
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

exports.getVisit = async (req, res) => {
  const id = req.params.id;

  Visit.findById(id)
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

exports.updateVisit = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Visit.updateOne({ _id: id }, req.body);

    if (result.n === 0) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({
      message: "Visit updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteVisit = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Visit.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({
      message: "Visit deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
