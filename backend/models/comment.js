const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    medic: { type: Boolean, required: true },
    medicUid: { type: String, required: true },
    patientUid: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;