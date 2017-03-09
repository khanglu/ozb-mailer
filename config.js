const sender = process.env.MAIL_USR
const receiver = process.env.MAIL_RCVR

const poolConfig = {
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.MAIL_USR,
    pass: process.env.MAIL_PWD
  }
};

const dbUrl = 'mongodb://' + process.env.MLAB_USR + ':' + process.env.MLAB_PWD +'@ds121980.mlab.com:21980/ozb-mailer'

module.exports = {sender, receiver, poolConfig, dbUrl}