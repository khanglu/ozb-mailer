const sender = 'ozb.mailer@gmail.com'
const receiver = 'lulephuckhang@gmail.com'

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