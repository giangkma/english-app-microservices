const accountApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller");

accountApi.post("/register", accountController.postRegisterAccount);
accountApi.post("/login", accountController.postLogin);

accountApi.post("/reset-password", accountController.postResetPassword);

accountApi.put(
  "/toggle-favorite",
  jwtAuthentication,
  accountController.putToggleFavorite
);
accountApi.put(
  "/update-coin",
  jwtAuthentication,
  accountController.putUpdateUserCoin
);
accountApi.put(
  "/update-avt",
  jwtAuthentication,
  accountController.putUpdateAvt
);
accountApi.put(
  "/update-profile",
  jwtAuthentication,
  accountController.putUpdateProfile
);

accountApi.get("/user-info", jwtAuthentication, accountController.getUserInfo);
accountApi.get("/send-verify-code", accountController.getVerifyCode);

accountApi.get(
  "/user-profile",
  jwtAuthentication,
  accountController.getUserProfile
);

module.exports = accountApi;
