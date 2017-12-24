const sender = process.env.MAIL_USR;

const poolConfig = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_USR,
    pass: process.env.MAIL_PWD
  }
};

const dbUrl =
  "mongodb://" +
  process.env.MLAB_USR +
  ":" +
  process.env.MLAB_PWD +
  "@ds121980.mlab.com:21980/ozb-mailer";

module.exports = { sender, poolConfig, dbUrl };
