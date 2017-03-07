const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const nodemailer = require('nodemailer')
const {sender, receiver, poolConfig} = require('./mailconfig')
const dealQualityAlgorithm = require('./dealQualityAlgorithm')
const moment = require('moment')

let transporter = nodemailer.createTransport(poolConfig)
const mins = 60
const the_interval = mins * 60 * 1000

// All logic for the mailer goes here
const ozbmailer = () => {
  // URL we will scrape from
  const url = 'http://www.ozbargain.com.au'
  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  request(url, (error, response, html) => {
    // First we'll check to make sure no errors occurred when making the request
    if(!error){
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      const $ = cheerio.load(html);
      let goodDeals = []
      // Finally, we'll define the variables we're going to capture
      $('.node-ozbdeal').map((i, node) => {
        const title = $(node).find($('h2.title')).find('a').text()
        const id = $(node).find($('h2.title')).find('a').attr('href').substr(6)
        const upvote = $(node).find($('span.voteup')).children().last().text()
        const description = $(node).find($('div.content')).children().text()
        const timeAgo = $(node).find($('div.submitted')).contents().filter((i, child) => (
          child.type === 'text'
        )).text().substring(4, 22);
        const deal = {
          title: title,
          id: id,
          upvote: upvote,
          description: description,
          timeAgo: timeAgo
        }
        if(dealQualityAlgorithm(parseInt(upvote),timeAgo)) {
          console.log(deal)
          goodDeals.push(deal)
        }
      })

      goodDeals.map((item) => {
        const agoString = moment(item.timeAgo, 'DD/MM/YYYY - hh:mm').fromNow() // E.g. 3 hours ago
        // Email format
        const message = {
          from: sender,
          to: receiver,
          subject: 'OZB Hot Deal: ' + item.title,
          text: JSON.stringify(item),
          html: '<p>' + item.upvote + ' upvotes. Deal posted ' + agoString + '. <a href="http://www.ozbargain.com.au/node/' + item.id + '">Link to deal</a>' + '</p>' +
                '<p>Description: ' + item.description + '</p>'
        };
        // Send email
        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err)
          }
          console.log(info)
        })
      })

    }
  })

}

// Run once before entering intervals
ozbmailer()
setInterval(ozbmailer, the_interval)

