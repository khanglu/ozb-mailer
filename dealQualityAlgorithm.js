const moment = require('moment-timezone')

const dealQualityAlgorithm = (upvoteCount, timeAgo) => {
  const timeThen = moment(timeAgo, 'DD/MM/YYYY - hh:mm').tz('Australia/Melbourne')
  const timeNow = moment()
  const timeDiff = timeNow.diff(timeThen, 'minutes')
  // Return true if deal has more than 30 upvotes/hours
  return timeDiff > 5 && upvoteCount/(timeDiff/60) > 20
}

module.exports = dealQualityAlgorithm