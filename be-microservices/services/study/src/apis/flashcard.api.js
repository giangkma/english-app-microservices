const flashcardApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const flashcardController = require("../controllers/flashcard.controller");

flashcardApi.get(
  "/word-pack",
  jwtAuthentication,
  flashcardController.getWordPack
);

flashcardApi.get(
  "/word-pack/total",
  jwtAuthentication,
  flashcardController.getTotalWordPack
);

module.exports = flashcardApi;
