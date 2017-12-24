const dealScraper = require("../deal-scraper/deal-scraper");
const emailMessage = require("../email-message/email-message");
const emailSender = require("../email-sender/email-sender");
const mins = 10;

const ozbmailer = database => {
  // The deal scrapper
  dealScraper(goodDeals => {
    // If there are any good deal returned from the scraper
    if (goodDeals.length > 0) {
      // Map through them
      goodDeals.map(deal => {
        // Insert it to the database first
        database.collection("deals").insertOne(deal, err => {
          // Handle database returning errors
          if (err) {
            // The most likely one is the duplicated error
            if (err.name === "MongoError" && err.code === 11000) {
              console.log("No new good deal! Just old deal duplicated!");
            } else {
              console.log(err);
            }
          } else {
            // Print out the deal title to the console
            console.log("New deal found: " + deal.title);
            // Get all emails from database, send the deal to each of them
            database
              .collection("emails")
              .find()
              .each((err, email) => {
                // .each will return null at the end so make sure you check for email availability
                if (email) {
                  const message = emailMessage(email.email_address, deal);
                  emailSender(message, email);
                }
              });
          }
        });
      });
    } else {
      console.log("No good deal!");
    }
  });
  console.log("Next fetch in " + mins + " minutes");
};

module.exports = ozbmailer;
