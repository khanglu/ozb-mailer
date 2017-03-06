const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

app.get('/scrape', function(req, res){
  // All magic goes here
})

app.listen('8081')
console.log('Magic happens on port 8081')

exports = module.exports = app;

