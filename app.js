const fs = require('fs')
const nodemailer = require('nodemailer')
const {sender, receiver, poolConfig, dbUrl} = require('./config')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const dealScraper = require('./dealScraper')

let transporter = nodemailer.createTransport(poolConfig)
// We run the whole process every 10 minutes
const mins = 10
const the_interval = mins * 60 * 1000


/* Brace yourself, callback hell is coming. I could have just gone with promises
 * but I want to try out how writing callbacks feels like, that way I can appreciate
 * promises and await/async more */

// For simple database interactions, MongoClient is more than sufficient
MongoClient.connect(dbUrl, (err, database) => {
  if (err) {
    console.log(err)
  }
  // The mailer itself
  const ozbmailer = () => {
    // The deal scrapper
    dealScraper((goodDeals) => {
      // If there are any good deal returned from the scraper
      if (goodDeals.length > 0) {
        // Map through them
        goodDeals.map((deal) => {
          // Insert it to the database first
          database.collection('deals').insertOne(deal, (err) => {
            // Handle database returning errors
            if (err) {
              // The most likely one is the duplicated error
              if (err.name === 'MongoError' && err.code === 11000) {
                console.log('No new good deal! Just old deal duplicated!')
              } else {
                console.log(err)
              }
            } else {
              // Print out the deal to the console
              console.log(deal)
              // Format email message
              const agoString = moment(deal.time_posted, 'DD/MM/YYYY - hh:mm').fromNow() // E.g. 3 hours ago
              const message = {
                from: sender,
                to: receiver,
                subject: deal.title,
                text: JSON.stringify(deal),
                html: '<p>' + '<a href="http://www.ozbargain.com.au/node/' + deal.deal_id + '">Link to deal</a>. Deal posted ' + agoString + '.</p>'
              };
              database.collection('emails').find().
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
    console.log('Next fetch in ' + mins + ' minutes')
  }

  // Run once before entering intervals
  ozbmailer()
  setInterval(ozbmailer, the_interval)
})



