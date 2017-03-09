const fs = require('fs')
const nodemailer = require('nodemailer')
const {sender, receiver, poolConfig, dbUrl} = require('./config')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const dealScraper = require('./dealScraper')

let transporter = nodemailer.createTransport(poolConfig)
const mins = 10
const the_interval = mins * 60 * 1000

// All logic for the mailer goes here
MongoClient.connect(dbUrl, (err, database) => {
  if (err) {
    console.log(err)
  }
  const ozbmailer = () => {
    dealScraper((goodDeals) => {
      if (goodDeals.length > 0) {
        console.log(goodDeals)
        goodDeals.map((item) => {
          database.collection('deals').insertOne(item, (err) => {
            if (err) {
              if (err.name === 'MongoError' && err.code === 11000) {
                // Do nothing
              } else {
                console.log(err)
              }
            } else {
              // Email format
              const agoString = moment(item.time_posted, 'DD/MM/YYYY - hh:mm').fromNow() // E.g. 3 hours ago
              const message = {
                from: sender,
                to: receiver,
                subject: item.title,
                text: JSON.stringify(item),
                html: '<p>' + '<a href="http://www.ozbargain.com.au/node/' + item.deal_id + '">Link to deal</a>' + item.upvote + ' upvotes. Deal posted ' + agoString + '.</p>'
              };
              // Send email
              transporter.sendMail(message, (err, info) => {
                if (err) {
                  console.log(err)
                }
                console.log('\nEMAIL SENT!')
              })
            }
          })
        })
      } else {
        console.log('No new good deal!')
      }
    })
  }

  // Run once before entering intervals
  ozbmailer()
  setInterval(ozbmailer, the_interval)
})



