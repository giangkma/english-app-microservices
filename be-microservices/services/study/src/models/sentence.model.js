const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { contributedStatusEnum, CONTRIBUTED_STATUS } = require("../contants");

const sentenceSchema = new Schema({
  sentence: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },

  mean: {
    type: String,
    required: true,
    trim: true,
    maxLength: 300,
  },

  note: {
    type: String,
    trim: true,
    maxLength: 100,
  },

  topics: [String],

  status: {
    type: String,
    enum: contributedStatusEnum,
    default: CONTRIBUTED_STATUS.PENDING,
  },

  isContributed: {
    type: Boolean,
    required: true,
    default: false,
  },

  contributedBy: {
    type: String,
    trim: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SentenceModel = mongoose.model("sentence", sentenceSchema, "sentences");

module.exports = SentenceModel;
