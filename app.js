if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { dbUrl } = require("./config");
const MongoClient = require("mongodb").MongoClient;
const ozbmailer = require("./mailer/mailer");

// We run the whole process every 10 minutes
const mins = 10;
const the_interval = mins * 60 * 1000;

// For simple database interactions, MongoClient is more than sufficient
MongoClient.connect(dbUrl, (err, database) => {
  if (err) {
    console.log(err);
  }
  // Run once before entering intervals
  ozbmailer(database);
  setInterval(() => ozbmailer(database), the_interval);
});
