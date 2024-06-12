const { isExistSentence } = require("../services/word.service");
const {
  createSentence,
  getTotalSentences: getTotalSentencesService,
  getSentenceList: getSentenceListService,
  acceptSentences,
  getDraftSentences,
  deleteDraftsentences,
  getMyContributedSentences,
} = require("../services/sentence.service");
const { checkUserIsContributor } = require("../helper/word-pack.helper");
const { CONTRIBUTED_STATUS } = require("../contants");

exports.postContributeSentence = async (req, res, next) => {
  try {
    const { sentence, mean, note, topics, ...rest } = req.body;
    const { user } = req;

    const isContributor = user && checkUserIsContributor(user.role);

    const isExist = await isExistSentence(sentence);

    if (isExist) {
      return res
        .status(409)
        .json({ message: "Câu đã tồn tại. Vui lòng thêm câu khác. Cảm ơn" });
    }

    const isCreated = await createSentence({
      sentence,
      mean,
      note,
      topics,
      status: isContributor
        ? CONTRIBUTED_STATUS.ACCEPTED
        : CONTRIBUTED_STATUS.PENDING,
      isContributed: true,
      contributedBy: user ? user._id : null,
      ...rest,
    });

    if (isCreated) {
      const message = isContributor
        ? "Tạo câu mới thành công"
        : "Câu của bạn đã được gửi, chúng tôi sẽ kiểm tra và duyệt sớm nhất";
      return res.status(200).json({
        message,
      });
    }

    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST CONTRIBUTE SENTENCE ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

// get my history contributed sentences
exports.getMyContributedSentences = async (req, res, next) => {
  try {
    const { user } = req;
    const sentences = await getMyContributedSentences(user._id);

    return res.status(200).json(sentences);
  } catch (error) {
    console.error("ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postAdminAcceptSentences = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const isAcceptSuccess = await acceptSentences(ids);
    if (isAcceptSuccess) {
      return res.status(200).json({ message: "Duyệt câu thành công" });
    }
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST ADMIN ACCEPT SENTENCES ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getListDraftSentences = async (req, res, next) => {
  try {
    const list = await getDraftSentences();
    return res.status(200).json(list);
  } catch (error) {
    console.error("GET LIST DRAFT SENTENCES ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.postDeleteDraftSentences = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const isDeleted = await deleteDraftsentences(ids);

    if (isDeleted) {
      return res.status(200).json({ message: "Xóa câu thành công" });
    }

    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  } catch (error) {
    console.error("POST DELETE DRAFT SENTENCES ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getTotalSentences = async (req, res, next) => {
  try {
    let { topics } = req.query;
    topics = typeof topics === "string" ? JSON.parse(topics) : [];

    const total = await getTotalSentencesService(topics);

    return res.status(200).json({ total });
  } catch (error) {
    console.error("GET TOTAL SENTENCES ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getSentenceList = async (req, res, next) => {
  try {
    let { page = 1, perPage = 20, topics } = req.query;
    topics = typeof topics === "string" ? JSON.parse(topics) : [];

    const sentenceList = await getSentenceListService(page, perPage, topics);

    return res.status(200).json({ sentenceList });
  } catch (error) {
    console.error(" ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
