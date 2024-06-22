const { uploadImage } = require("../../../../libs/cloudinary.lib");
const { CONTRIBUTED_STATUS } = require("../contants");
const { checkUserIsContributor } = require("../helper/word-pack.helper");

const {
  createNewWord,
  searchWord,
  getWordDetail,
  getFavoriteList,
  isExistWord,
  getWordPack,
  acceptWords,
  deleteAllContributedWords,
  deleteDraftWords,
  getMyContributedWords,
  updateWord,
} = require("../services/word.service");

exports.postContributeWord = async (req, res, next) => {
  try {
    const { picture, word, type, ...rest } = req.body;
    const { user } = req;
    const isContributor = user && checkUserIsContributor(user.role);

    // check existence of word
    const isExist = await isExistWord(word, type);
    if (isExist) {
      return res
        .status(409)
        .json({ message: `Từ "${word} (${type})" đã tồn tại trong từ điển` });
    }

    // upload description picture if available
    let pictureUrl = null;
    if (picture) {
      pictureUrl = await uploadImage(picture, "dynonary/words");
    }

    // create the new word
    const isCreateSuccess = await createNewWord({
      word,
      type,
      picture: pictureUrl,
      status: isContributor
        ? CONTRIBUTED_STATUS.ACCEPTED
        : CONTRIBUTED_STATUS.PENDING,
      isContributed: true,
      contributedBy: user ? user.email : null,
      ...rest,
    });

    if (isCreateSuccess) {
      const message = isContributor
        ? "Tạo từ mới thành công"
        : "Từ của bạn đã được gửi, chúng tôi sẽ kiểm tra và duyệt sớm nhất";
      return res.status(200).json({
        message,
      });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST CONTRIBUTE WORD ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.putUpdateWord = async (req, res, next) => {
  try {
    const { picture, ...rest } = req.body;
    const { user } = req;
    const { id } = req.params;
    const isContributor = user && checkUserIsContributor(user.role);

    if (!isContributor) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện hành động này" });
    }

    // upload description picture if available
    let pictureUrl = null;
    if (picture && picture.includes("cloudinary")) {
      pictureUrl = picture;
    } else {
      pictureUrl = await uploadImage(picture, "dynonary/words");
    }

    // create the new word
    const updateSuccess = await updateWord({
      id,
      wordInfo: {
        picture: pictureUrl,
        ...rest,
      },
    });

    if (updateSuccess) {
      return res.status(200).json({
        message: "Cập nhật từ thành công",
      });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("UPDATE WORD ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

// get my history contributed words
exports.getMyContributedWords = async (req, res, next) => {
  try {
    const { user } = req;
    const words = await getMyContributedWords(user.email);

    return res.status(200).json(words);
  } catch (error) {
    console.error("ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postAdminAcceptWords = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const isAcceptSuccess = await acceptWords(ids);
    if (isAcceptSuccess) {
      return res.status(200).json({ message: "Duyệt từ thành công" });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST ADMIN ACCEPT WORDS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postDeleteDraftWords = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const isDeleteSuccess = await deleteDraftWords(ids);
    if (isDeleteSuccess) {
      return res.status(200).json({ message: "Xóa từ thành công" });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST DELETE DRAFT WORDS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postDeleteAllContributedWords = async (req, res, next) => {
  try {
    const isDeleteSuccess = await deleteAllContributedWords();
    if (isDeleteSuccess) {
      return res.status(200).json({ message: "Xóa từ thành công" });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST DELETE ALL CONTRIBUTE WORDS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getCheckWordExistence = async (req, res) => {
  try {
    const { word, type } = req.query;
    const isExist = await isExistWord(word, type);
    return res.status(200).json({ isExist });
  } catch (error) {
    console.error("GET CHECK WORD EXIST ERROR: ", error);
    return res.status(200).json({ isExist: false });
  }
};

exports.getWordPack = async (req, res) => {
  try {
    const {
      page,
      perPage,
      packInfo,
      sortType,
      sortBy,
      status = CONTRIBUTED_STATUS.ACCEPTED,
      search,
    } = req.query;

    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;
    const packList = await getWordPack(
      packInfo ? JSON.parse(packInfo) : null,
      skip,
      perPageInt,
      "",
      sortType === "asc" ? "1" : sortType === "desc" ? "-1" : null,
      sortBy,
      {
        status,
        ...(search && {
          $or: [
            { word: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { mean: { $regex: search, $options: "i" } },
            { phonetic: { $regex: search, $options: "i" } },
            {
              contributedBy: { $regex: search, $options: "i" },
            },
            {
              level: { $regex: search, $options: "i" },
            },
          ],
        }),
      }
    );

    return res.status(200).json({ packList });
  } catch (error) {
    console.error("WORD GET WORD PACK ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getSearchWord = async (req, res) => {
  try {
    const { word, isCompact = false } = req.query;
    const list = await searchWord(
      word,
      20,
      isCompact == "true" ? "-_id word" : "-_id type word mean phonetic picture"
    );
    return res.status(200).json({ packList: list });
  } catch (error) {
    console.error("GET SEARCH WORD ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getWordDetails = async (req, res, next) => {
  try {
    const { word } = req.query;
    const wordDetail = await getWordDetail(word);
    if (wordDetail) {
      return res.status(200).json(wordDetail);
    }
  } catch (error) {
    console.error("GET WORD DETAILS ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getUserFavoriteList = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user || !user.favoriteList) {
      return res.status(400).json({ message: "failed" });
    }

    const { favoriteList } = user;
    if (!Array.isArray(favoriteList) || favoriteList.length === 0) {
      return res.status(200).json({ list: [] });
    }

    let { page, perPage, sortType } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    let favoriteSorted = [...favoriteList];
    if (sortType === "asc") {
      favoriteSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    } else if (sortType === "desc") {
      favoriteSorted.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
    }
    favoriteSorted = favoriteSorted.slice((page - 1) * perPage, page * perPage);

    const packList = await getFavoriteList(favoriteSorted);

    return res.status(200).json({ packList });
  } catch (error) {
    console.error(" ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
