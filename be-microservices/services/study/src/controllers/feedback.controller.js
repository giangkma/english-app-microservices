const {
  createNewFeedback,
  getFeedbacks,
  deleteFeedback,
} = require("../services/feedback.service");

exports.postNewFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    const { user } = req;

    const created = await createNewFeedback({
      feedback,
      createdBy: user ? user._id : null,
    });
    return res.status(200).json(created);
  } catch (error) {
    console.error("CREATE FEEDBACK ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await getFeedbacks();
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("GET FEEDBACKS ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteFeedback(id);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("DELETE FEEDBACK ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
