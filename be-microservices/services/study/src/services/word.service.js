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

exports.searchWord = async (word = "", limit = 20, select = "") => {
  try {
    const regex = new RegExp(`^${word}.*`, "gi");
    const list = await WordModel.find({ word: regex })
      .limit(limit)
      .select(select);
    return list;
  } catch (error) {
    throw error;
  }
};

exports.getWordDetail = async (word = "") => {
  try {
    const res = await WordModel.findOne({ word });

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
      const wordDetails = await WordModel.findOne({ word: regex }).select(
        "-_id type word mean phonetic picture"
      );
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
  return await SentenceModel.exists({ sentence: newRegex });
};

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = "",
  sortType = null,
  expandQuery = null
) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);

    // add expand query
    if (expandQuery && typeof expandQuery === "object") {
      Object.assign(query, expandQuery);
    }

    const packList = await WordModel.find(query)
      .sort({ word: sortType })
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
    return await WordModel.countDocuments(query);
  } catch (error) {
    throw error;
  }
};
