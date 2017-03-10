const moment = require('moment')

const emailMessage = (receiver, deal) => {
  // Format email message
  const agoString = moment(deal.time_posted, 'DD/MM/YYYY - hh:mm').fromNow() // E.g. 3 hours ago
  return {
    from: process.env.MAIL_USR,
    to: receiver,
    subject: deal.title,
    text: JSON.stringify(deal),
    html: '<p>' + '<a href="http://www.ozbargain.com.au/node/' + deal.deal_id + '">Link to deal</a>. Deal posted ' + agoString + '.</p>'
  }
}

module.exports = emailMessage
