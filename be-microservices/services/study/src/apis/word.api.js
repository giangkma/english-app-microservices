const wordApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const wordController = require("../controllers/word.controller");

wordApi.post("/contribute/add-word", wordController.postContributeWord);

wordApi.post(
  "/admin/contribute/accept-words",
  wordController.postAdminAcceptWords
);

wordApi.post("/admin/delete-words", wordController.postDeleteDraftWords);

wordApi.post(
  "/admin/contribute/delete-words",
  wordController.postDeleteAllContributedWords
);

wordApi.get("/exist", wordController.getCheckWordExistence);

wordApi.get("/pack", wordController.getWordPack);

wordApi.get("/search-word", wordController.getSearchWord);

wordApi.get("/word-details", wordController.getWordDetails);

wordApi.get(
  "/favorite-list",
  jwtAuthentication,
  wordController.getUserFavoriteList
);

module.exports = wordApi;
