const { createUsername, generateVerifyCode } = require("../helper");
const bcrypt = require("bcryptjs");
const {
  isExistAccount,
  createAccount,
  createUser,
  findAccount,
  updateFavoriteList,
  isExistWordInFavorites,
  isLimitedFavorites,
  updateUserCoin,
  updatePassword,
  getProfile,
  updateAvt,
  updateProfile,
  saveVerifyCode,
  checkVerifyCode,
  removeVerifyCode,
  getAllUsers,
  setContributor,
  findAccountById,
  updateAccountStatus,
} = require("../services/account.service");
const { ACCOUNT_TYPES, MAX, ACCOUNT_ROLES } = require("../../../../constant");
const jwtConfig = require("../configs/jwt.config");
const mailConfig = require("../configs/mail.config");

exports.postRegisterAccount = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase();

    // check account existence
    const isExist = await isExistAccount(email);
    if (isExist) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // create an account
    const newAccountId = await createAccount(email, password);
    if (!newAccountId) {
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }

    // create an user
    const username = createUsername(email, newAccountId);
    const newUser = await createUser(newAccountId, username, name);
    if (!newUser) {
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }

    return res.status(200).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    console.error("POST REGISTER ACCOUNT ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password, isAdmin } = req.body;

    // check account existence
    const account = await findAccount(email);
    if (!account) {
      return res.status(406).json({ message: "Tài khoản không tồn tại" });
    }
    if (!account.active) {
      return res.status(401).json({
        message:
          "Tài khoản của bạn đã bị khoá, vui lòng liên hệ với quản trị viên để biết thêm thông tin",
      });
    }

    if (isAdmin && account.role !== ACCOUNT_ROLES.ADMIN) {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // set cookie with jwt
    const token = await jwtConfig.encodedToken("amonino", {
      accountId: account._id,
    });

    return res.status(200).json({
      message: "success",
      token,
    });
  } catch (error) {
    console.error("POST REGISTER ACCOUNT ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { isContributor, search = "" } = req.query;
    const users = await getAllUsers(isContributor, search);
    return res.status(200).json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.setContributor = async (req, res) => {
  try {
    const { accountId, isContributor } = req.body;

    const account = await findAccountById(accountId);
    if (!account) {
      return res.status(406).json({ message: "Tài khoản không tồn tại" });
    }
    if (!account.active) {
      return res.status(401).json({
        message:
          "Tài khoản này đã bị khoá, vui lòng mở khoá trước khi thay đổi",
      });
    }

    const update = await setContributor(accountId, isContributor);
    if (update) {
      const mail = {
        to: "giangdt.kma@gmail.com",
      };
      if (isContributor) {
        mail.subject = "Trở thành đóng góp viên";
        mail.html = mailConfig.htmlContributor();
      } else {
        mail.subject = "Hủy đóng góp viên";
        mail.html = mailConfig.htmlContributorRevoke();
      }

      await mailConfig.sendEmail(mail);

      return res.status(200).json({ message: "success" });
    }

    return res.status(409).json({ message: "failed" });
  } catch (error) {
    console.error("PUT SET CONTRIBUTOR ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putUpdateAccountStatus = async (req, res) => {
  try {
    const { accountId, active } = req.body;

    const account = await findAccountById(accountId);
    if (!account) {
      return res.status(406).json({ message: "Tài khoản không tồn tại" });
    }

    const update = await updateAccountStatus(accountId, active);
    if (update) {
      return res.status(200).json({ message: "success" });
    }

    return res.status(409).json({ message: "failed" });
  } catch (error) {
    console.error("PUT UPDATE ACCOUNT STATUS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postResetPassword = async (req, res) => {
  try {
    const { email, verifyCode, password } = req.body;

    const { status, message } = await checkVerifyCode(verifyCode, email);
    if (!status) {
      return res.status(400).json({ message });
    }

    const isUpdated = await updatePassword(email, password);

    removeVerifyCode(email);

    if (isUpdated) {
      return res.status(200).json({ message: "success" });
    }

    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST RESET PASSOWORD ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putToggleFavorite = async (req, res) => {
  try {
    const { word, username, isAdd = false } = req.body;

    const isExist = await isExistWordInFavorites(word, username);

    if (isAdd) {
      const isLimited = await isLimitedFavorites(word, username);

      if (isLimited) {
        return res.status(409).json({
          message:
            "Số từ đã vượt quá số lượng tối đa của danh sách yêu thích. Hãy nâng cấp nó.",
        });
      }

      if (isExist) {
        return res
          .status(406)
          .json({ message: `Từ ${word} đã tồn tại trong danh sách` });
      }
    } else {
      if (!isExist) {
        return res
          .status(406)
          .json({ message: `Từ ${word} không tồn tại trong danh sách` });
      }
    }

    const updateStatus = await updateFavoriteList(word, username, isAdd);

    if (updateStatus && updateStatus.ok && updateStatus.nModified) {
      return res.status(200).json({ message: "success" });
    } else {
      return res.status(409).json({ message: "failed" });
    }
  } catch (error) {
    console.error("PUT TOGGLE FAVORITE ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putUpdateUserCoin = async (req, res) => {
  try {
    const { newCoin } = req.body;
    const username = req.user?.username;
    if (!username) {
      return res.status(406).json({ message: "Not Accept" });
    }

    const update = await updateUserCoin(newCoin, username);

    if (update) {
      return res.status(200).json({ message: "success" });
    }

    return res.status(406).json({ message: "Not Accept" });
  } catch (error) {
    console.error("PUT UPDATE USER COIN ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putUpdateAvt = async (req, res, next) => {
  try {
    const { user } = req;
    const { avtSrc } = req.body;
    if (!Boolean(avtSrc) || !Boolean(user)) {
      return res.status(400).json({ message: "failed" });
    }
    const update = await updateAvt(user.username, avtSrc);

    if (!update) {
      return res.status(400).json({ message: "failed" });
    }

    return res.status(200).json({ newSrc: update });
  } catch (error) {
    console.error("PUT UPDATE AVT ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putUpdateProfile = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, username } = req.body;
    if (!Boolean(user)) {
      return res.status(400).json({ message: "Cập nhập thất bại" });
    }

    const update = await updateProfile(user.username, name, username);
    if (!update.status) {
      return res.status(400).json({ message: update.message });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("PUT UPDATE PROFILE ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { isAuth = false } = res.locals;
    if (!isAuth) {
      return res.status(401).json({ message: "Failed" });
    }
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("GET USER INFO ERROR: ", error);
    return res.status(401).json({ message: "Failed" });
  }
};

exports.getVerifyCode = async (req, res) => {
  try {
    const { email } = req.query;
    if (!Boolean(email)) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const isExist = await isExistAccount(email);
    if (!isExist) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const verifyCode = generateVerifyCode(MAX.VERIFY_CODE);

    const mail = {
      to: email,
      subject: "Mã xác nhận đổi mật khẩu",
      html: mailConfig.htmlResetPassword(verifyCode),
    };

    await mailConfig.sendEmail(mail);
    saveVerifyCode(verifyCode, email);

    return res
      .status(200)
      .json({ message: "Gửi mã thành công. Hãy kiểm tra Email của bạn" });
  } catch (error) {
    console.error("GET VERIFY CODE ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "failed" });
    }
    const { accountId } = req.user;

    const userInfo = await getProfile(accountId);
    if (!userInfo) {
      return res.status(403).json({ message: "failed" });
    }

    return res
      .status(200)
      .json({ email: userInfo.email, createdDate: userInfo.createdDate });
  } catch (error) {
    console.error("GET USER PROFILE ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
