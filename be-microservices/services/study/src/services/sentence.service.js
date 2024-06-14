const { CONTRIBUTED_STATUS } = require("../contants");
const { addTopicsQuery } = require("../helper/word-pack.helper");
const SentenceModel = require("../models/sentence.model");

exports.createSentence = async (info) => {
  try {
    const result = SentenceModel.create({ ...info });
    if (result) return true;
    return false;
  } catch (error) {
    throw error;
  }
};

exports.acceptSentences = async (ids = []) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      await SentenceModel.updateMany(
        {},
        { status: CONTRIBUTED_STATUS.ACCEPTED }
      );
    } else {
      await SentenceModel.updateMany(
        { _id: { $in: ids } },
        { status: CONTRIBUTED_STATUS.ACCEPTED }
      );
    }

    return true;
  } catch (error) {
    throw error;
  }
};

exports.getDraftSentences = async () => {
  try {
    return await SentenceModel.find({ status: CONTRIBUTED_STATUS.PENDING });
  } catch (error) {
    throw error;
  }
};

exports.deleteDraftsentences = async (ids = []) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      await SentenceModel.updateMany(
        { status: CONTRIBUTED_STATUS.PENDING },
        {
          status: CONTRIBUTED_STATUS.REJECTED,
        }
      );
    }
    await SentenceModel.updateMany({
      _id: { $in: ids },
      status: CONTRIBUTED_STATUS.REJECTED,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

exports.getTotalSentences = async (topics = []) => {
  try {
    let query = { status: CONTRIBUTED_STATUS.ACCEPTED };

    // query multiple topic
    addTopicsQuery(topics, query);

    const total = await SentenceModel.countDocuments(query);
    return total;
  } catch (error) {
    throw error;
  }
};

exports.getSentenceList = async (page = 1, perPage = 20, topics = []) => {
  try {
    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    let query = { status: CONTRIBUTED_STATUS.ACCEPTED };
    // query multiple topic
    addTopicsQuery(topics, query);

    const list = await SentenceModel.find(query)
      .skip(skip)
      .limit(perPageInt)
      .select("-_id -status -topics");

    return list;
  } catch (error) {
    throw error;
  }
};

exports.getMyContributedSentences = async (email) => {
  try {
    return await SentenceModel.find({ contributedBy: email }).sort({
      updatedAt: -1,
    });
  } catch (error) {
    throw error;
  }
};
