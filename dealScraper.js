const cheerio = require('cheerio')
const request = require('request')
const dealQualityAlgorithm = require('./dealQualityAlgorithm')

const dealScraper = (callback) => {
  request('http://www.ozbargain.com.au', (error, response, html) => {
    // First we'll check to make sure no errors occurred when making the request
    if(!error){
      // Next, use cheerio to query the DOM
      const $ = cheerio.load(html);
      let goodDeals = []
      // Map through all deal nodes
      $('.node-ozbdeal').map((i, node) => {
        const deal_id = $(node).find($('h2.title')).find('a').attr('href').substr(6)
        const title = $(node).find($('h2.title')).find('a').text()
        const upvote = $(node).find($('span.voteup')).children().last().text()
        const time_posted = $(node).find($('div.submitted')).contents().filter((i, child) => (
          child.type === 'text'
        )).text().substring(4, 22);
        const description = $(node).find($('div.content')).children().text()
        const deal = {
          title: title,
          deal_id: deal_id,
          upvote: upvote,
          description: description,
          time_posted: time_posted
        }
        if(dealQualityAlgorithm(parseInt(upvote),time_posted)) {
          console.log(deal)
          goodDeals.push(deal)
        }
      })
      callback(goodDeals)
    }
  })
}

module.exports = dealScraper