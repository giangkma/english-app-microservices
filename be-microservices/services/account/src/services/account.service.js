const { ACCOUNT_TYPES, MAX } = require("../../../../constant");
const { hashPassword } = require("../helper");
const AccountModel = require("../models/account.model");
const VerifyCodeModel = require("../models/verify-code.model");
const UserModel = require("../models/user.model");
const { uploadImage } = require("../../../../libs/cloudinary.lib");

exports.isExistAccount = async (email) => {
  try {
    return await AccountModel.exists({ email });
  } catch (error) {
    throw error;
  }
};

exports.findAccount = async (email) => {
  try {
    return await AccountModel.findOne({ email });
  } catch (error) {
    throw error;
  }
};

exports.createAccount = async (
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL
) => {
  try {
    const newAccount = await AccountModel.create({
      email,
      password,
      authType,
      createdDate: new Date(),
    });
    if (newAccount && newAccount._id) return newAccount._id;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (accountId, username, name, avt = "") => {
  try {
    const newUser = await UserModel.create({ accountId, name, username, avt });
    if (newUser && newUser._id) return newUser;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.isExistWordInFavorites = async (word, username) => {
  try {
    const regex = new RegExp(word, "i");
    const isExist = await UserModel.exists({
      username,
      favoriteList: {
        $in: regex,
      },
    });

    return isExist;
  } catch (error) {
    throw error;
  }
};

exports.isLimitedFavorites = async (word, username) => {
  try {
    // check limit amount
    const user = await UserModel.findOne({ username }).select("favoriteList");
    const { favoriteList = null } = user;

    if (
      Array.isArray(favoriteList) &&
      favoriteList.length >= MAX.FAVORITES_LEN
    ) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateFavoriteList = async (word, username, isAdd = false) => {
  try {
    if (isAdd) {
      return await UserModel.updateOne(
        { username },
        { $push: { favoriteList: word } }
      );
    }

    return await UserModel.updateOne(
      { username },
      { $pull: { favoriteList: { $in: word } } }
    );
  } catch (error) {
    throw error;
  }
};

exports.updateUserCoin = async (newCoin = 0, username = "") => {
  try {
    if (
      newCoin < 0 ||
      newCoin > MAX.USER_COIN ||
      !username ||
      username === ""
    ) {
      return false;
    }

    const updateRes = await UserModel.updateOne(
      { username },
      { coin: newCoin }
    );

    if (updateRes.ok) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (email = "", newPassword = "") => {
  try {
    const hashPw = await hashPassword(newPassword);

    const res = await AccountModel.updateOne({ email }, { password: hashPw });

    if (res.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateAvt = async (username = "", avtSrc = "") => {
  try {
    const picture = await uploadImage(avtSrc, "dynonary/user-avt");
    const isUpdated = await UserModel.updateOne({ username }, { avt: picture });
    if (isUpdated.n && isUpdated.ok) return picture;

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateProfile = async (
  username = "",
  newName = "",
  newUsername = ""
) => {
  try {
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      const isExist = await UserModel.exists({ username: newUsername });
      if (isExist) {
        return { status: false, message: "username đã được sử dụng" };
      }
    }

    const isUpdated = await UserModel.updateOne(
      { username },
      { name: newName, username: newUsername }
    );

    if (isUpdated.n && isUpdated.ok)
      return { status: true, message: "success" };

    return false;
  } catch (error) {
    throw error;
  }
};

exports.getProfile = async (accountId = "") => {
  try {
    const account = await AccountModel.findById(accountId).select(
      "email createdDate"
    );
    return account;
  } catch (error) {
    throw error;
  }
};

exports.saveVerifyCode = async (code = "", email = "") => {
  try {
    // delete old code
    await VerifyCodeModel.deleteOne({ email });

    const newItem = await VerifyCodeModel.create({
      code,
      email,
      createdDate: new Date(),
    });
    return newItem;
  } catch (error) {
    throw error;
  }
};

exports.checkVerifyCode = async (code = "", email = "") => {
  try {
    const item = await VerifyCodeModel.findOne({ email, code });

    if (!item) {
      return { status: false, message: "Hãy gửi mã để nhận mã xác thực." };
    }

    if (item.code !== code) {
      return { status: false, message: "Mã xác thực không đúng." };
    }

    const d = new Date().getTime(),
      createdDate = new Date(item.createdDate).getTime();

    if (d - createdDate > MAX.VERIFY_TIME) {
      return {
        status: false,
        message: "Mã xác thực đã hết hiệu lực. Hãy lấy một mã khác",
      };
    }

    return { status: true, message: "valid" };
  } catch (error) {
    throw error;
  }
};

exports.removeVerifyCode = async (email = "") => {
  try {
    await VerifyCodeModel.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};

exports.getUserInfoByAccountId = async (accountId = "") => {
  try {
    const user = await UserModel.findOne({ accountId }).select(
      "-_id username name avt favoriteList coin"
    );
    if (user) return user._doc;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.subscribeEvents = async (payload) => {
  const { event, data } = payload;

  switch (event) {
    case "GET_USER_INFO_BY_ACCOUNT_ID":
      return this.getUserInfoByAccountId(data.accountId);
    default:
      break;
  }
};
