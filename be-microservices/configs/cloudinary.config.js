require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "math-database",
  api_key: "496858915933528",
  api_secret: "THEUtYJ6jx1RTh0yHPiP56Btll0",
});

module.exports = { cloudinary };
