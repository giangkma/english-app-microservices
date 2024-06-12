const sentenceApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const sentenceController = require("../controllers/sentence.controller");

sentenceApi.post(
  "/contribute/add-sentence",
  jwtAuthentication,
  sentenceController.postContributeSentence
);

sentenceApi.get(
  "/my-contributed",
  jwtAuthentication,
  sentenceController.getMyContributedSentences
);

sentenceApi.post(
  "/admin/contribute/accept-sentences",
  jwtAuthentication,
  sentenceController.postAdminAcceptSentences
);

sentenceApi.get(
  "/admin/contribute/draft-sentences",
  jwtAuthentication,
  sentenceController.getListDraftSentences
);

sentenceApi.delete(
  "/admin/contribute/delete-sentences",
  jwtAuthentication,
  sentenceController.postDeleteDraftSentences
);

sentenceApi.get(
  "/total",
  jwtAuthentication,
  sentenceController.getTotalSentences
);

sentenceApi.get("/list", jwtAuthentication, sentenceController.getSentenceList);

module.exports = sentenceApi;
