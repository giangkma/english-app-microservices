const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const feedbackController = require("../controllers/feedback.controller");

const feedbackApi = require("express").Router();

feedbackApi.post(
  "/create",
  jwtAuthentication,
  feedbackController.postNewFeedback
);

feedbackApi.get("/list", jwtAuthentication, feedbackController.getFeedbacks);

feedbackApi.delete(
  "/delete/:id",
  jwtAuthentication,
  feedbackController.deleteFeedback
);

module.exports = feedbackApi;
