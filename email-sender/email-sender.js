const nodemailer = require("nodemailer");
const { poolConfig } = require("../config");
let transporter = nodemailer.createTransport(poolConfig);

const emailSender = (message, email) => {
  transporter.sendMail(message, err => {
    if (err) {
      console.log(err);
    }
    console.log("\nEmail sent to " + email.email_address);
  });
};

module.exports = emailSender;
