const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  feedback: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeedbackModel = mongoose.model("feeback", feedbackSchema, "feebacks");

module.exports = FeedbackModel;
