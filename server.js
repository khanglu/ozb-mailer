const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

app.get('/scrape', (req, res) => {
  // URL we will scrape from
  const url = 'http://www.ozbargain.com.au'
  let deals = []
  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  request(url, (error, response, html) => {
    // First we'll check to make sure no errors occurred when making the request
    if(!error){
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      const $ = cheerio.load(html);
      let deals = []
      // Finally, we'll define the variables we're going to capture
      $('.node-ozbdeal').map((i, node) => {
        const title = $(node).find($('h2.title')).children().text()
        const voteup = $(node).find($('span.voteup')).children().last().text()
        const deal = {title: title, voteup: voteup}
        console.log(deal)
        deals.push(deal)
      })

      // To write to the system we will use the built in 'fs' library.
      // In this example we will pass 3 parameters to the writeFile function
      // Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(deals, null, 4) - the data to write
      // Parameter 3 :  callback function - a callback function to let us know the status of our function
      fs.writeFile('output.json', JSON.stringify(deals, null, 2), function(err){
        if(err){
          console.log(err)
        }
        console.log('File successfully written! - Check your project directory for the output.json file');
      })
    }
  })

  // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
  res.send('Check your console!')
})

app.listen('8081')
console.log('Magic happens on port 8081')

exports = module.exports = app;

