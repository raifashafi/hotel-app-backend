const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    // Additional fields as necessary
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
