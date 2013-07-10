Reeves Kiosk
--

![http://kiosk.reevesimportmotorcars.com](https://raw.github.com/createch/ghettocli/master/models-audi-s4.png)

This repo powers an Android-based kiosk placed in International Plaza for luxury car dealership Reeves.

The kiosk, written using Javascript and Phonegap, follows the MVC pattern, works offline, and performs bi-directional synchronisations of car data, base-64 encoded images, and new leads.

Monthly special data is captured using the scraper/app.js file. It uses Node.js to automate the scraping of Reeves' websites and Dealer.com and produces a SQL file that can be imported into the database.