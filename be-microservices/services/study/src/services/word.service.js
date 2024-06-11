const { convertPackInfoToQueryStr } = require("../helper/word-pack.helper");
const WordModel = require("../models/word.model");

exports.createNewWord = async (wordInfo) => {
  try {
    const newWord = await WordModel.create({ ...wordInfo });

    if (newWord) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.acceptWords = async (ids = []) => {
  try {
    let query = {};
    if (!Array.isArray(ids) || ids.length === 0) {
      query = { isChecked: false };
    } else {
      query = { _id: { $in: ids } };
    }
    await WordModel.updateMany(query, {
      isChecked: true,
      isContributed: true,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.deleteDraftWords = async (ids = []) => {
  try {
    if (Array.isArray(ids) && ids.length !== 0) {
      await WordModel.deleteMany({ _id: { $in: ids } });
    }
    return true;
  } catch (error) {
    throw error;
  }
};

exports.deleteAllContributedWords = async () => {
  try {
    await WordModel.deleteMany({ isContributed: true });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.searchWord = async (word = "", limit = 20, select = "") => {
  try {
    const regex = new RegExp(`^${word}.*`, "gi");
    const list = await WordModel.find({ word: regex, isChecked: true })
      .limit(limit)
      .select(select);
    return list;
  } catch (error) {
    throw error;
  }
};

exports.getWordDetail = async (word = "") => {
  try {
    const res = await WordModel.findOne({ word, isChecked: true });

    return res;
  } catch (error) {
    throw error;
  }
};

exports.getFavoriteList = async (rawFavorites = []) => {
  try {
    if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) {
      return [];
    }

    let list = [];
    for (let word of rawFavorites) {
      const regex = new RegExp(`^${word}.*`, "gi");
      const wordDetails = await WordModel.findOne({
        word: regex,
        isChecked: true,
      }).select("-_id type word mean phonetic picture");
      if (wordDetails) {
        list.push(wordDetails);
      }
    }

    return list;
  } catch (error) {
    throw error;
  }
};

exports.isExistWord = async (word = "", type = "") => {
  try {
    if (word === "" || type === "") {
      return false;
    }

    return await WordModel.exists({ word, type });
  } catch (error) {
    throw error;
  }
};

exports.isExistSentence = async (sentence = "") => {
  if (sentence === "") return false;
  const newRegex = new RegExp(sentence, "i");
  return await SentenceModel.exists({ sentence: newRegex, isChecked: true });
};

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = "",
  sortType = null,
  sortBy = "word",
  expandQuery = null
) => {
  try {
    let query = packInfo ? convertPackInfoToQueryStr(packInfo) : {};

    // add expand query
    if (expandQuery && typeof expandQuery === "object") {
      Object.assign(query, expandQuery);
    }

    const packList = await WordModel.find(query)
      .sort({
        [sortBy]: sortType,
      })
      .skip(skip)
      .limit(limit)
      .select(select);

    return packList;
  } catch (error) {
    throw error;
  }
};

exports.countWordPack = async (packInfo = {}) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);
    return await WordModel.countDocuments({ ...query, isChecked: true });
  } catch (error) {
    throw error;
  }
};
