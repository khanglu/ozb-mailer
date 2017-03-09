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
    moment().format('MMMM Do YYYY, h:mm:ss a')
    dealScraper((goodDeals) => {
      if (goodDeals.length > 0) {
        goodDeals.map((deal) => {
          database.collection('deals').insertOne(deal, (err) => {
            if (err) {
              if (err.name === 'MongoError' && err.code === 11000) {
                console.log('No new good deal! Just old deals!')
              } else {
                console.log(err)
              }
            } else {
              // Print out the deal to the console
              console.log(deal)
              // Email format
              const agoString = moment(deal.time_posted, 'DD/MM/YYYY - hh:mm').fromNow() // E.g. 3 hours ago
              const message = {
                from: sender,
                to: receiver,
                subject: deal.title,
                text: JSON.stringify(deal),
                html: '<p>' + '<a href="http://www.ozbargain.com.au/node/' + deal.deal_id + '">Link to deal</a>. Deal posted ' + agoString + '.</p>'
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
        console.log('No good deal!')
      }
    })
  }

  // Run once before entering intervals
  ozbmailer()
  setInterval(ozbmailer, the_interval)
})



