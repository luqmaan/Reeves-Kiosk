console.log("hai")

var Crawler = require("crawler").Crawler
	fs = require('fs'),
	path = require('path'),
	scraper = require('./scraper'),
	config = require('./config'),
	jsdom = require("jsdom"),
	sys = require('sys'),
	exec = require('child_process').exec


// empty the file before we begin
var file = path.join(__dirname, config.filename)
fs.unlink(file)
console.log("Writing data to " + file)

// run it
crawl("audi", config.audi_urls, scraper.dealerDotCom, saveResults)
crawl("subaru", config.subaru_urls, scraper.dealerDotCom, saveResults)
crawl("bmw", config.bmw_urls, scraper.bmw, saveResults)
crawl("audi", config.audi_urls, scraper.dealerDotCom, saveResults)
crawl("subaru", config.subaru_urls, scraper.dealerDotCom, saveResults)
crawl("bmw", config.bmw_urls, scraper.bmw, saveResults)
crawl("vw", config.vw_urls, scraper.vw, saveResults)
crawl("landrover", config.landrover_urls, scraper.landRover, saveResults)

function crawl(brand, urls, scrapeIt, resultCallback) {

	for (var u in urls) {

		var html = urls[u]

		// for some reason, JSDOM doesn't fetch the html for landrover URLs, but curl does, so lets use curl
		if (brand == "landrover") {
			exec("curl " + urls[u], function puts(error, stdout, stderr) {
				html = stdout
				callJSDOM(u)
			})
		}
		else {
			callJSDOM(u)
		}
	}

	function callJSDOM(u) {
		// this is wrapped in a function so that it can be called at either place in the if statement
		// pass u as u is not available in this context
		// placed within the function crawl(), so that brand, urls and scrapeIt are in context
		jsdom.env(
			html,
			["http://code.jquery.com/jquery.js"],
	        function (errors, window) {
	            console.log("Got " + urls[u])
	            scrapeIt(window.$,{ brand: brand,headline: "", description: "",img_url: "", base64: "", insert: ""},resultCallback)
	        }
		)
	}
}

function saveResults(special) {

	// append data to the file asynchrously
	fs.appendFile(file, special.insert + "\n", function(err) {
	  if (err) throw err
	})
	console.log("-> Saved " + special.brand + " : " + special.headline)
}
