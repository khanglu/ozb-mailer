if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { dbUrl } = require("./config");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(dbUrl, { useNewUrlParser: true });
const ozbmailer = require("./mailer/mailer");

// We run the whole process every 10 minutes
const mins = 10;
const the_interval = mins * 60 * 1000;

// For simple database interactions, MongoClient is more than sufficient
client.connect((err, database) => {
  if (err) {
    console.log(err);
  }
  // Run once before entering intervals
  ozbmailer(client.db("ozb-mailer"));
  setInterval(() => ozbmailer(database), the_interval);
});
