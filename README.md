# ozb-mailer

### How it works
- Fetches all of the front page deals from the OzBargain front page
- Evaluates whether a deal has expired, ran out of stock or is still valid
- Constructs a JSON to house all of the deals
- Process the JSON through an algorithm to determine whether a deal is good or not
- If a deal is good, then add to mongoDB and send email(s) to designated email address(es)

### Powered by
- [cheerio](https://github.com/cheeriojs/cheerio) - jQuery implementation on the server
- [nodemailer](https://github.com/nodemailer/nodemailer) - Send emails with Node.js
- [mongodb](https://github.com/mongodb/mongo) - The MongoDB Database
- [request](https://github.com/request/request) - Simplified HTTP request client
- [moment.js](https://github.com/moment/moment) - Powerful date time library
- [heroku](https://www.heroku.com/) - PaaS for deployment
