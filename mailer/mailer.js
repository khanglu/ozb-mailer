const dealScraper = require("../deal-scraper/deal-scraper");
const emailMessage = require("../email-message/email-message");
const emailSender = require("../email-sender/email-sender");
const mins = 10;

const ozbmailer = database => {
  if (!database) {
    console.error("MongoDB database is not available.");
    return;
  }
  // The deal scraper
  dealScraper(goodDeals => {
    if (!goodDeals || goodDeals.length < 1) {
      console.log("No good deals!");
      return;
    }
    // If there are any good deal returned from the scraper map them
    goodDeals.map(deal => {
      // Insert it to the database first
      database.collection("deals").insertOne(deal, err => {
        // Handle database errors
        if (err) {
          // The most likely one is the duplicated error
          if (err.name === "MongoError" && err.code === 11000) {
            console.log("No new good deal! Just old deal duplicated!");
          } else {
            console.error(err);
          }
        } else {
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
    console.log("Next fetch in " + mins + " minutes");
  });
};
module.exports = ozbmailer;
