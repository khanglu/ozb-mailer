const moment = require('moment')

const dealQualityAlgorithm = (upvoteCount, timeAgo) => {
  const timeThen = moment(timeAgo, 'DD/MM/YYYY - hh:mm')
  const timeNow = moment()
  const timeDiff = timeNow.diff(timeThen, 'minutes')
  return timeDiff > 5 && upvoteCount/(timeDiff/60) > 20
}

module.exports = dealQualityAlgorithm