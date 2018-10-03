### OzBargain-Mailer

### How it works
- Fetches all the deals from the OzBargain front page.
- Evaluates whether a deal has expired, run out of stock or is still valid
- Constructs a JSON to house all of the deals
- Processes the JSON through an algorithm to determine whether a deal is good or not
- If a deal is good, then its adds to mongoDB and sends an email(s) to the designated email address(es)

### Powered by
- [cheerio](https://github.com/cheeriojs/cheerio) - jQuery implementation on the server
- [nodemailer](https://github.com/nodemailer/nodemailer) - Send emails with Node.js
- [mongodb](https://github.com/mongodb/mongo) - The MongoDB Database
- [request](https://github.com/request/request) - Simplified HTTP request client
- [moment.js](https://github.com/moment/moment) - Powerful date time library
- [heroku](https://www.heroku.com/) - PaaS for deployment
