const sender = process.env.MAIL_USR;

const poolConfig = {
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USR,
    pass: process.env.MAIL_PWD
  }
};

const dbUrl =
  "mongodb+srv://" + 
  process.env.MLAB_USR +
  ":" +
  process.env.MLAB_PWD +
  "@cluster0.4fazy.mongodb.net/ozb-mailer?retryWrites=true&w=majority"

module.exports = { sender, poolConfig, dbUrl };
