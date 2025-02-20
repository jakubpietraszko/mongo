const mongoose = require("mongoose");
const Patient = require("../models/patient");

exports.createPatient = async (req, res) => {
  const { name, surname, ban, birthdate, gender } = req.body;
  const patient = new Patient({
    _id: new mongoose.Types.ObjectId(),
    name,
    surname,
    ban,
    birthdate,
    gender,
  });

  patient
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created patient successfully",
        createdPatient: {
          _id: result._id,
          name: result.name,
          surname: result.surname,
          ban: result.ban,
          birthdate: result.birthdate,
          gender: result.gender,
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

exports.getPatients = async (req, res) => {
  Patient.find()
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

exports.getPatient = async (req, res) => {
  const id = req.params.id;
  Patient.findById(id)
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

exports.updatePatient = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Patient.updateOne({ _id: id }, req.body);

    if (result.n === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deletePatient = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Patient.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
