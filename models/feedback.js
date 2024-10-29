const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    rating: { type: String, required: true },
    suggestions: { type: String },
    additionalComments: { type: String },
    recommend: { type: String, required: true },
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;