## ozb-mailer

### How it works
- Scrape ozbargain to get all front page deals
- Evaluate either a deal has expired, out of stock or still valid
- Construct JSON of the deals, send it through an algorithm to determine whether the deal is good or not
- If deal is good, add to mongoDB, send email to designated emails

### Powered by
- [cheerio](https://github.com/cheeriojs/cheerio) - jQuery implementation on the server
- [nodemailer](https://github.com/nodemailer/nodemailer) - Send emails with Node.js
- [mongodb](https://github.com/mongodb/mongo) - The MongoDB Database
- [request](https://github.com/request/request) - Simplified HTTP request client
- [moment.js](https://github.com/moment/moment) - Powerful date time library
- [heroku](https://www.heroku.com/) - PaaS for deployment