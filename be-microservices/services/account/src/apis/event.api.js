const accountService = require("../services/account.service");
const eventApi = require("express").Router();

eventApi.post("/app-events", async (req, res) => {
  try {
    const { payload } = req.body;

    const result = await accountService.subscribeEvents(payload);
    res.json(result);
  } catch (error) {
    throw error;
  }
});

module.exports = eventApi;
