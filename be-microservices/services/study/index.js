// import third-party
const express = require("express");
const cors = require("cors");

const corsConfig = require("../../configs/cors.config");

// import local file
const { MAX } = require("../../constant");
const wordApi = require("./src/apis/word.api");
const gameApi = require("./src/apis/game.api");
const flashcardApi = require("./src/apis/flashcard.api");
const sentenceApi = require("./src/apis/sentence.api");
const blogApi = require("./src/apis/blog.api");
const feedbackApi = require("./src/apis/feedback.api");

// ================== set port ==================
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.STUDY_PORT || 3000);

// ================== setup ==================
const dev = app.get("env") !== "production";

// ================== Connect mongodb with mongoose ==================
const mongoose = require("mongoose");

const MONGO_URL =
  (dev ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL) +
  process.env.STUDY_DB_NAME;

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// ================== config ==================
app.use(express.json({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: MAX.SIZE_JSON_REQUEST, extended: true }));
app.use(cors(corsConfig));

// ================== Apis ==================
app.use(`/word`, wordApi);
app.use(`/games`, gameApi);
app.use(`/flashcard`, flashcardApi);
app.use(`/sentence`, sentenceApi);
app.use(`/blog`, blogApi);
app.use(`/feedback`, feedbackApi);

// ================== Listening ... ==================
app.listen(PORT, () => {
  console.log(`Study Service: ${PORT}`);
});
