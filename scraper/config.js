/********************/
/* Le Configuración */
/********************/

exports.filename = "inserts.sql"

exports.audi_urls = [
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A4+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A5+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A6+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A7+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A8+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+Q5+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+S4+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+allroad+Wagon+Specials"]

exports.subaru_urls = [
	"http://www.subaruoftampa.com/specials/index.htm?category=Forester",
	"http://www.subaruoftampa.com/specials/index.htm?category=Impreza",
	"http://www.subaruoftampa.com/specials/index.htm?category=Tribeca",
	"http://www.subaruoftampa.com/specials/index.htm?category=Legacy",
	"http://www.subaruoftampa.com/specials/index.htm?category=Impreza+WRX",
	"http://www.subaruoftampa.com/specials/index.htm?category=Outback"]

exports.bmw_urls = ["http://www.bmwsouthernoffers.com/Finance/leaseoffers.aspx?iframe=y"]

exports.vw_urls = ["http://www.reevesvw.com/Specials?pageNumber=&bottomView=75"]

exports.landrover_urls = [
	"http://www.reevesimportmotorcars.com/brands/land-rover/new/specials/lr2.aspx",
	"http://www.reevesimportmotorcars.com/brands/land-rover/new/specials/lr4.aspx",
	"http://www.reevesimportmotorcars.com/brands/land-rover/new/specials/rrsport.aspx",
	"http://www.reevesimportmotorcars.com/brands/land-rover/new/specials/rr.aspx",
	"http://www.reevesimportmotorcars.com/brands/land-rover/new/specials/evoque-specials.aspx"]

for (var i in exports.landrover_urls) {
	exports.landrover_urls[i] += "?PrinterFriendly=True"
}