const mongoose = require("mongoose");
const Medic = require("../models/medic");

exports.createMedic = async (req, res) => {
  const { name, surname, type } = req.body;
  const medic = new Medic({
    _id: new mongoose.Types.ObjectId(),
    name,
    surname,
    type,
  });

  medic
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created medic successfully",
        createdMedic: {
          _id: result._id,
          name: result.name,
          surname: result.surname,
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

exports.getMedics = async (req, res) => {
  Medic.find()
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

exports.getMedic = async (req, res) => {
  const id = req.params.id;
  Medic.findById(id)
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

exports.updateMedic = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Medic.updateOne({ _id: id }, req.body);

    if (result.n === 0) {
      return res.status(404).json({ message: "Medic not found" });
    }

    res.status(200).json({
      message: "Medic updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteMedic = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Medic.deleteOne({ _id: id });
    if (result.n === 0) {
      return res.status(404).json({ message: "Medic not found" });
    }
    res.status(200).json({
      message: "Medic deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
