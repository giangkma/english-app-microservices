const {
  updateTop,
  getLeaderboardWithName,
} = require("../services/hightscore.service");

exports.putUpdateHighScore = async (req, res, next) => {
  try {
    const { name, score } = req.body;
    const { accountId } = req.user;

    if (!accountId) {
      return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
    }

    const update = await updateTop(accountId, name, score);

    if (update) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    console.error("PUT UPDATE HIGHT SCORE ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!Boolean(name)) {
      return res.status(400).json({ message: "failed" });
    }

    const list = await getLeaderboardWithName(name);

    return res.status(200).json({ list });
  } catch (error) {
    console.error("GET LEADERBOARD ERROR: ", error);
    return res.status(500).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
