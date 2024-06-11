const sentenceApi = require('express').Router();
const sentenceController = require('../controllers/sentence.controller');

sentenceApi.post(
  '/contribute/add-sentence',
  sentenceController.postContributeSentence,
);

sentenceApi.post(
  "/admin/contribute/accept-sentences",
  sentenceController.postAdminAcceptSentences
);

sentenceApi.get(
  "/admin/contribute/draft-sentences",
  sentenceController.getListDraftSentences
);

sentenceApi.delete(
  "/admin/contribute/delete-sentences",
  sentenceController.postDeleteDraftSentences
);

sentenceApi.get('/total', sentenceController.getTotalSentences);

sentenceApi.get('/list', sentenceController.getSentenceList);

module.exports = sentenceApi;
