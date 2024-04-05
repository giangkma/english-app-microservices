// set environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

const corsConfig = require("./configs/cors.config");

app.use(cors(corsConfig));
app.use(express.json());

app.use("/account", proxy("http://localhost:" + process.env.ACCOUNT_PORT));
app.use("/highscore", proxy("http://localhost:" + process.env.HIGHSCORE_PORT));
app.use("/", proxy("http://localhost:" + process.env.STUDY_PORT));

const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.GATE_WAY_PORT || 3000);

app.listen(PORT, () => {
  console.log("Gateway: ", PORT);
});
