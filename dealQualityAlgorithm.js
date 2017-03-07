const timeStringToFloat = (timeString) => {
  // E.g. ' 8 hours 32 minutes ago ' will return ["8","32"]
  const timeArray = timeString.match(/\d+/g)
  // E.g. ["8","32"] to 8.53
  return parseFloat(timeArray[0]) + parseFloat(timeArray[1])/60
}


// This will be optimised overtime
const dealQualityAlgorithm = (upvoteCount, timeAgo) => {
  const time = timeStringToFloat(timeAgo)

  return time > .5 && upvoteCount/time > 10
}

module.exports = dealQualityAlgorithm