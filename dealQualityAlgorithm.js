const moment = require('moment')

// This will be optimised overtime
const dealQualityAlgorithm = (upvoteCount, timeAgo) => {
  const timeThen = moment(timeAgo, 'DD/MM/YYYY - hh:mm')
  const timeNow = moment()
  const timeDiff = timeNow.diff(timeThen, 'minutes')

  return timeDiff > 30 && upvoteCount/(timeDiff/60) > 10
}

module.exports = dealQualityAlgorithm