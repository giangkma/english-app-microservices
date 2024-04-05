// import third-party
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// import local file
const { MAX } = require("../../constant");
const corsConfig = require("../../configs/cors.config");
const accountApi = require("./src/apis/account.api");
const eventApi = require("./src/apis/event.api");

// ================== set port ==================
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.ACCOUNT_PORT || 3000);

// ================== setup ==================
const dev = app.get("env") !== "production";

// ================== Connect mongodb with mongoose ==================
const mongoose = require("mongoose");

const MONGO_URL =
  (dev ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL) +
  process.env.ACCOUNT_DB_NAME;

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// ================== config ==================
app.use(express.json({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(cookieParser());
app.use(cors(corsConfig));

// ================== Listening ... ==================
app.listen(PORT, () => {
  console.log(`Account Service: ${PORT}`);
});

// ================== Apis ==================
app.use(accountApi);
app.use(eventApi);
