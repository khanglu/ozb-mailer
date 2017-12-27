const moment = require("moment");

const dealQualityAlgorithm = (upvoteCount, timeAgo, qualityRatio = 20) => {
  const timeThen = moment(timeAgo, "DD/MM/YYYY - hh:mm");
  const timeNow = moment();
  const timeDiff = timeNow.diff(timeThen, "minutes");
  return timeDiff > 5 && upvoteCount / (timeDiff / 60) > qualityRatio;
};

module.exports = dealQualityAlgorithm;
