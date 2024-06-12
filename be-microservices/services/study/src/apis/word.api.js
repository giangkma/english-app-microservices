const wordApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const wordController = require("../controllers/word.controller");

wordApi.post(
  "/contribute/add-word",
  jwtAuthentication,
  wordController.postContributeWord
);

wordApi.get(
  "/my-contributed",
  jwtAuthentication,
  wordController.getMyContributedWords
);

wordApi.post(
  "/admin/contribute/accept-words",
  jwtAuthentication,
  wordController.postAdminAcceptWords
);

wordApi.post(
  "/admin/delete-words",
  jwtAuthentication,
  wordController.postDeleteDraftWords
);

wordApi.post(
  "/admin/contribute/delete-words",
  jwtAuthentication,
  wordController.postDeleteAllContributedWords
);

wordApi.get("/exist", jwtAuthentication, wordController.getCheckWordExistence);

wordApi.get("/pack", jwtAuthentication, wordController.getWordPack);

wordApi.get("/search-word", jwtAuthentication, wordController.getSearchWord);

wordApi.get("/word-details", jwtAuthentication, wordController.getWordDetails);

wordApi.get(
  "/favorite-list",
  jwtAuthentication,
  wordController.getUserFavoriteList
);

module.exports = wordApi;
