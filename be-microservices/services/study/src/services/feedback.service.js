const FeedbackModel = require("../models/feeback.model");

exports.createNewFeedback = async (data) => {
  try {
    const res = await FeedbackModel.create({ ...data });
    return res;
  } catch (error) {
    throw error;
  }
};

exports.getFeedbacks = async () => {
  try {
    return await FeedbackModel.find();
  } catch (error) {
    throw error;
  }
};

exports.deleteFeedback = async (id) => {
  try {
    return await FeedbackModel.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
};
