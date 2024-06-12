const CONTRIBUTED_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const contributedStatusEnum = (function () {
  let list = [];
  for (let k in CONTRIBUTED_STATUS) {
    list.push(CONTRIBUTED_STATUS[k]);
  }
  return list;
})();

module.exports = {
  CONTRIBUTED_STATUS,
  contributedStatusEnum,
};
