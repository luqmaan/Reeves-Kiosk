/** scraper.js
 * 	Contains the scraper functions
 * 	Scrapers receive a jQueryified DOM and return an array of INSERTS 
 */

var http = require('http')
var request = require('request')

exports.bmw = function($,specialTemplate,callback) {

	$(".offer").each(function() {

		var special = clone(specialTemplate)

		// get data
		special.img_url = $(this).find("img").attr("src")
		special.headline = $(this).find("h4").text()
		special.description = $(this).find("a").filter(function() {
			return $(this).css("display") === "block"
		}).text()

		// clean data
		special.headline = clean(special.headline)
		special.description = clean(special.description)

		getImage(special, callback)

	})

}

exports.dealerDotCom = function($,special,callback) {

	// handle no specials
	var no_specials_indicator = strip($(".bd2 .highlight.ui-state.ui-state-highlight.ui-corner-all").text())
	if (no_specials_indicator.indexOf("specialsareavailableatthistime.Pleasecheckbacklater!") != -1)
		return false

	// get data
	special.headline = $(".dsbTitle").text()
	special.price = $(".dsbPriceCont").text()
	special.details = $(".dsbCont").html()
	special.img_url = $(".imageEditable").attr("src")

	// clean data
	special.headline = clean(special.headline)
	special.price = clean(special.price)
	special.details = clean(special.details)

	special.description = special.price + "<br />" + special.details

	getImage(special, callback)

}

exports.vw = function($, specialTemplate, callback) {

	$(".special-container").each(function() {

		console.log($(this).find("img").attr("src"))

		var special = clone(specialTemplate)

		special.headline = $(this).find(".special-title").text()
		special.description = $(this).find(".description").text()
		special.img_url = $(this).find(".special-photo img").attr("src")

		special.headline = clean(special.headline)
		special.description = clean(special.description)

		getImage(special, callback)	

	})

}

exports.landRover = function($,special,callback) {

	console.log("Haihaihai from landrover")

	// get data
	special.img_url = $("tr td > img").attr("src")
	special.headline = $("h3").first().text()
	special.description = $("tr td span strong").first().html()

	// clean data
	special.headline = clean(special.headline)
	special.description = clean(special.description)

	console.log("image: " + special.img_url);
	console.log("headline: " + special.headline)
	console.log("description: " + special.description)

	getImage(special, callback)

}

function getImage(special, callback) {

    // node can only GET http images, so make https urls http
    special.img_url = special.img_url.replace(/https/g, "http")

    console.log("Loading " + special.img_url)

    /** @type {Array} stores the binary chunks in a single array for later concatenation */
    var dataChunks = []
    /** @type {Number} stores the total length of the binary chunk */
    var len = 0

    // GET the image
    var request = http.get(special.img_url)
    request.on('response', function (res) {

        console.log("Downloaded "  + special.img_url)

        /** as data is received, push it onto the dataChunks array */
        res.on('data', function (chunk) {
            console.log(chunk);
            dataChunks.push(chunk)
            len += chunk.length
        })

        /** when all data has been received */
        res.on('end', function() {
        	// concatenate the data chunks into a single buffer of binary data
            data = Buffer.concat(dataChunks)
            // convert that buffer to base 64
            special.base64 = data.toString('base64')
            // store it
            special.insert = prepareInsert(special)
            // the special is ready! call the callback!
            callback(special)
        })
    })


}
/** prepares the INSERT statement using a special object */
function prepareInsert(special) {
	var insert = "INSERT INTO `specials` (`make`, `thumb`, `headline`, `description`, `base64`) "
	insert += "VALUES ('" + special.brand + "', '', '"+  special.headline+ "', '" + special.description + "', '" + special.base64 + "');"
	return insert
}
/** prepares a string to be inserted into the db */
function clean(str) {
	// remove &nbsp;
	// replace multiple spaces and new lines with a signle space
	// remove " and '
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, " ").replace(/\"/g, '').replace(/\'/g, '')
}
/** kills whitespace, for comparing equality of text */
function strip(str) {
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, "")
}

/** http://stackoverflow.com/questions/728360/copying-an-object-in-javascript */
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date()
        copy.setTime(obj.getTime())
        return copy
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = []
        var len = obj.length
        for (var i = 0; i < len; ++i) {
            copy[i] = clone(obj[i])
        }
        return copy
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {}
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
        }
        return copy
    }

    throw new Error("Unable to copy obj! Its type isn't supported.")
}