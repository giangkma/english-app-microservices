const gameApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const gameController = require("../controllers/game.controller");

// ======== CORRECT WORD GAME ========
gameApi.get(
  "/correct-word/pack",
  jwtAuthentication,
  gameController.getWordPackCWG
);

// ======== WORD MATCH GAME ========
gameApi.get(
  "/word-match/pack",
  jwtAuthentication,
  gameController.getWordPackWMG
);

// ======== FAST GAME ========
gameApi.get("/fast-game/pack", jwtAuthentication, gameController.getWordPackFS);

module.exports = gameApi;
