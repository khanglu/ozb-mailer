const fs = require('fs')
const nodemailer = require('nodemailer')
const { poolConfig, dbUrl } = require('./config')
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const dealScraper = require('./dealScraper')
const emailMessage = require('./emailMessage')

let transporter = nodemailer.createTransport(poolConfig)
// We run the whole process every 10 minutes
const mins = 10
const the_interval = mins * 60 * 1000


/* Brace yourself, callback hell is coming. */

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
              // Print out the deal title to the console
              console.log('New deal found: ' + deal.title)
              // Get all emails from database, send the deal to each of them
              database.collection('emails').find().each((err, email) => {
                // .each will return null at the end so make sure you check for email availability
                if(email) {
                  const message = emailMessage(email.email_address, deal)
                  transporter.sendMail(message, (err, info) => {
                    if (err) {
                      console.log(err)
                    }
                    console.log('\nEmail sent to ' + email.email_address)
                  })
                }
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

