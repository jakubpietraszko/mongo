const mongoose = require('mongoose');

const MedicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    type: { type: String, required: true },
})

const Medic = mongoose.model('Medic', MedicSchema);

module.exports = Medic;