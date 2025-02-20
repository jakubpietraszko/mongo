const mongoose = require("mongoose");
const Comment = require("../models/comment");

exports.createComment = async (req, res) => {
  const { date, medic, medicUid, patientUid, text, time } = req.body;
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    date,
    medic,
    medicUid,
    patientUid,
    text,
    time,
  });

  comment
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created comment successfully",
        createdComment: {
          _id: result._id,
          date: result.date,
          medic: result.medic,
          medicUid: result.medicUid,
          patientUid: result.patientUid,
          text: result.text,
          time: result.time,
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

exports.getComments = async (req, res) => {
  Comment.find()
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

exports.getComment = async (req, res) => {
  const id = req.params.id;
  Comment.findById(id)
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

exports.updateComment = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Comment.updateOne({ _id: id }, req.body);

    if (result.n === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Comment.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
