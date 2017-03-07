const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const nodemailer = require('nodemailer')
const {sender, receiver, poolConfig} = require('./mailconfig')
const dealQualityAlgorithm = require('./dealQualityAlgorithm')

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
        const link = $(node).find($('h2.title')).find('a').attr('href')
        const upvote = $(node).find($('span.voteup')).children().last().text()
        const description = $(node).find($('div.content')).children().text()
        const timeAgo = $(node).find($('div.submitted')).contents().filter((i, child) => (
          child.type === 'text'
        )).text();
        const deal = {
          title: title,
          link: link,
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
        // Email format
        const message = {
          from: sender,
          to: receiver,
          subject: 'OZB Hot Deal: ' + item.title,
          text: JSON.stringify(item),
          html: '<p>' + item.upvote + ' upvotes in' + item.timeAgo + '. <a href="http://www.ozbargain.com.au' + item.link + '">Link to deal</a>' + '</p>' +
                '<p>' + item.description + '</p>'
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

