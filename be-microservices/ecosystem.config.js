module.exports = {
  apps: [
    {
      name: "account",
      script: "services/account/index.js",
      watch: true,
      autorestart: false,
    },
    {
      name: "study",
      script: "services/study/index.js",
      watch: true,
      autorestart: false,
    },
    {
      name: "highscore",
      script: "services/highscore/index.js",
      watch: true,
      autorestart: false,
    },
    {
      name: "gateway",
      script: "gateway.js",
      watch: true,
      autorestart: false,
    },
  ],
};
