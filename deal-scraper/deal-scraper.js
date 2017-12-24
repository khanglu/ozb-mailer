const cheerio = require("cheerio");
const request = require("request");
const dealQualityAlgorithm = require("../deal-quality-algorithm/deal-quality-algorithm");

const dealScraper = callback => {
  request("http://www.ozbargain.com.au", (error, response, html) => {
    // First we'll check to make sure no errors occurred when making the request
    if (!error) {
      // Next, use cheerio to query the DOM
      const $ = cheerio.load(html);
      let goodDeals = [];
      // Map through all deal nodes
      $(".node-ozbdeal").map((i, node) => {
        const dealExpiredTag = $(node)
          .find($("span.expired"))
          .text();
        // First check if deal is Expired or Out of stock
        if (
          !dealExpiredTag.includes("expired") &&
          !dealExpiredTag.includes("out of stock")
        ) {
          // Getting all needed information
          const deal_id = $(node)
            .find($("h2.title"))
            .find("a")
            .attr("href")
            .substr(6);
          const title = $(node)
            .find($("h2.title"))
            .find("a")
            .text();
          const upvote = $(node)
            .find($("span.voteup"))
            .children()
            .last()
            .text();
          const time_posted = $(node)
            .find($("div.submitted"))
            .contents()
            .filter((i, child) => child.type === "text")
            .text()
            .substring(4, 22);
          // Construct the deal object
          const deal = {
            title: title,
            deal_id: deal_id,
            upvote: upvote,
            time_posted: time_posted
          };
          // Check if the deal is good
          if (dealQualityAlgorithm(parseInt(upvote), time_posted)) {
            // If it's good, push it to the goodDeals array, get ready to add to database and send out via email
            goodDeals.push(deal);
          }
        }
      });
      callback(goodDeals);
    }
  });
};

module.exports = dealScraper;
