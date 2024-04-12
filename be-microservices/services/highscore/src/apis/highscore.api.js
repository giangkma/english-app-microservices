const highscoreApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const highscoreController = require("../controllers/highscore.controller");

highscoreApi.put(
  "/update",
  jwtAuthentication,
  highscoreController.putUpdateHighScore
);

highscoreApi.get("/leaderboard", highscoreController.getLeaderboard);

module.exports = highscoreApi;
