(function () {

    window.data = {

        init: function () {
            // le closure
            

            // open the database
            data.db = html5sql.openDatabase("com.reeves.kiosk.db", "Reeves DB", 40 * 1024 * 1024);


            html5sql.process("SELECT * FROM versions", function (tx, results) {

                // The versions table exists
                // So lets update the other tables
                console.log("versions table exists");
                data.updateTables();

            }, function (error, statement) {

                // The versions table doesn't exist.
                // This means this is the first time the app has run or the browser has reset the db
                if (error.code === 5) {
                    console.log("versions table does not exist");

                    data.emptyDB(function() {
                        
                        html5sql.process(data.populateDB, function(tx, results) {
                            console.log("Database populated");

                            data.updateTables();

                        }, data.error);

                    });

                }

            });

            setInterval(data.updateTables, config.syncInterval);


        },

        modelsForMake: function () {
            var make = arguments[0];
            var callback = arguments[1];

            var query = "SELECT * FROM models WHERE make = '" + make + "' ORDER BY price ASC";

            html5sql.process(query, callback, data.error);
        },

        model: function () {
            var id = arguments[0];
            var callback = arguments[1];

            var query = "SELECT * FROM models WHERE id = '" + id + "'";

            html5sql.process(query, callback, data.error);

        },

        saveContact: function () {
            
            var contact = arguments[0];
            var timestamp = new Date().toTimestamp();

            var query = "INSERT INTO contacts ( first,last,email,phone,make,model,contact_time,page ) VALUES ( '" + contact.first + "','" + contact.last + "','" + contact.email + "','" + contact.phone + "','" + contact.make + "','" + contact.model + "','" + timestamp + "','" + contact.page + "' );";

            html5sql.process(query, data.syncContacts, data.error);

        },

        syncContacts: function () {

            if (config.online) {
                console.log("online");
                data.postContacts();
            } else {
                console.log("offline");
                setTimeout(data.syncContacts, config.syncInterval);
            }
        },

        postContacts: function () {
            

            var changes = {};
            var query = "SELECT * FROM CONTACTS";
            html5sql.process(query, function (tx, contacts) {
                for (var i = 0; i < contacts.rows.length; ++i) {
                    changes[i] = contacts.rows.item(i);

                    console.log(changes);
                }
                $.ajax({
                    type: 'POST',
                    url: 'http://kiosk.reevesimportmotorcars.com/server/receiveContact.php',
                    data: changes,
                    success: function () {
                        console.log("succesfully synced contacts");
                        data.emptyContacts();
                    },
                    error: function () {
                        console.log("error");
                        setTimeout(data.syncContacts, config.syncInterval);
                    },
                    dataType: "jsonp"
                });
            }, data.error);
        },

        emptyContacts: function () {
            
            var query = "DELETE FROM CONTACTS";
            html5sql.process(query, function (tx, contacts) {
                console.log("emptied contacts");
            }, data.error);

        },

        specials: function () {
            var make = arguments[0];
            var callback = arguments[1];

            var query = "SELECT * FROM specials WHERE make = '" + make + "' ORDER BY leorder";

            html5sql.process(query, callback, data.error);

        },
        // Transaction error callback
        //
        error: function (error, statement) {
            console.error("Error: " + error.message + " when processing " + statement);
        },

        makes: {
            "audi": {
                "name": "Audi",
                "specials_url": "http://www.auditampa.com/global-incentives/index.htm?redirect=false",
                "logo": "_0027_Audi.png"
            },
            "vw": {
                "name": "Volkswagen",
                "specials_url": "http://www.reevesvw.com/Specials?device=immobile",
                "logo": "_0021_V.png"
            },
            "subaru": {
                "name": "Subaru",
                "specials_url": "http://www.reevesimportmotorcars.com/brands/subaru/specials.aspx",
                "logo": "_0022_Subaru.png"
            },
            "porsche": {
                "name": "Porsche",
                "specials_url": "http://www.reevesimportmotorcars.com/brands/porsche/specials.aspx",
                "logo": "_0023_Porsche.png"
            },
            "maserati": {
                "name": "Maserati",
                "specials_url": "http://www.reevesimportmotorcars.com/brands/maserati/new/inventory.aspx",
                "logo": "_0024_Maserati.png"
            },
            "landrover": {
                "name": "Land Rover",
                "specials_url": "http://www.reevesimportmotorcars.com/brands/land-rover/specials/new.aspx",
                "logo": "_0025_LandRover.png"
            },
            "bmw": {
                "name": "BMW",
                "specials_url": "http://www.reevesimportmotorcars.com/brands/bmw/specials.aspx",
                "logo": "_0026_BMW.png"
            }
        },

        emptyDB: function() {

            // optional callback
            var callback = arguments[0] || function() {
                console.log("Dropped all of the tables!");
            };

            html5sql.process(data.dropTables, callback, data.error);

        },

        trueEmptyDB: function() {

            data.emptyDB(function() {
                
                html5sql.process(data.populateDB, function(tx, results) {
                    console.log("Database populated");

                    data.updateTables();

                }, data.error);

            });

        },

        dropTables: [
        // Drop and reset everything
        "DROP TABLE IF EXISTS models", "DROP TABLE IF EXISTS specials", "DROP TABLE IF EXISTS contacts", "DROP TABLE IF EXISTS versions"
        ],

        populateDB: [

        // Populated the models tab
        "CREATE TABLE IF NOT EXISTS models (id integer PRIMARY KEY,make TEXT,'make_name' TEXT,model TEXT,image TEXT,thumb TEXT,features TEXT,price integer,'mpg_city' integer,'mpg_hwy' integer,'updated_on' timestamp,'created_on' timestamp,leorder integer);", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '355','audi','Audi','A4','A4SEDANBIG.jpg','AVSedan.jpg','- 17\" wheels with all-season tires<br />- Four-spoke, leather-wrapped steering wheel<br />- Audi premium sound system with SiriusXM<br />- Power front seats with driver lumbar support','32500','22','30','2012-02-16 23:42:50','0000-00-00 00:00:00','18' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '356','audi','Audi','A3','A3big.jpg','A3Sportback.jpg','- 17\" wheels with all-seaason tires<br />- S line® exterior<br />- Audi premium sound system with SiriusXM Satellite Radio','27270','21','30','2012-02-16 23:42:50','0000-00-00 00:00:00','17' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '357','audi','Audi','A4 Avant','A4AVANTBIG.jpg','A4Avant.jpg','- 17\" wheels with all-season tires<br />- Four-spoke, leather-wrapped steering wheel<br />- Audi premium sound system<br />- Single-zone climate control','36400','21','29','2012-02-16 23:42:50','0000-00-00 00:00:00','16' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '358','audi','Audi','A5','A5BIG.jpg','AV5Coupe.jpg','- Audi sound system<br />- Single-zone automatic climate control<br />- Leather seating surfaces<br />- Tilting glass panorama sunroof','37100','21','31','2012-02-16 23:42:50','0000-00-00 00:00:00','14' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '359','audi','Audi','S4','S4BIG.jpg','S4Sedan.jpg','- BLUETOOTH mobile phone preparation<br />- Driver memory<br />- Dual-exhaust with quad tailpipes<br />- HomeLink remote transmitter','47300','18','28','2012-02-16 23:42:50','0000-00-00 00:00:00','15' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '360','vw','Volkswagen','Jetta','JETTABIG.jpg','jetta-copy.jpg','- 2.0L, 4 cylinder engine, 115 hp<br />- Laser seam welding<br />- Remote keyless entry<br />- Intelligent Crash Response System<br />- Sound system with MP3','16645','24','34','2012-02-16 23:42:48','0000-00-00 00:00:00','12' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '361','vw','Volkswagen','Jetta SportWagen','JETTAWAGENBIG.jpg','jettasportswagen.jpg','- 2.5L, 170-hp, 5-cylinder engine<br />- 8-speaker sound system with MP3<br />- Intelligent Crash Response System (ICRS)<br />- Electronic Stability Control (ESC)','20195','23','33','2012-02-16 23:42:48','0000-00-00 00:00:00','11' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '362','vw','Volkswagen','Passat','PASSATBIG.jpg','passat-copy.jpg','- 2.5L, 170 hp, cylinder engine<br />- Bluetooth technology<br />- Climatronic climate control<br />- Electronic Stability Control (ESC)','19995','21','32','2012-02-16 23:42:48','0000-00-00 00:00:00','10' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '363','vw','Volkswagen','CC','CCBIG.jpg','cc-copy.jpg','- 2.0L, 200-hp TSI engine<br />- 17\" Phoenix alloy wheels<br />- Touchscreen Premium sound system<br />- 6 Airbags<br />- Electronic Stability Control (ESC)','28515','21','31','2012-02-16 23:42:48','0000-00-00 00:00:00','8' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '364','vw','Volkswagen','Tiguan','TIGUANBIG.jpg','Tiguan.jpg','- 2.0L, 200-hp TSI engine<br />- Bluetooth® technology<br />- Sound system with MP3<br />- Electronic Stability Control (ESC)','22840','18','26','2012-02-16 23:42:48','0000-00-00 00:00:00','9' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '365','vw','Volkswagen','Touareg','TOUAREGBIG.jpg','touareg.jpg','- 3.6L, 280 hp, V6 engine<br />- Bluetooth technology<br />- Bi-Xenon high-intensity headlights<br />- Automatic transmission with Tiptronic','43375','16','23','2012-02-16 23:42:48','0000-00-00 00:00:00','7' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '366','vw','Volkswagen','Routan','ROUTANBIG.jpg','routan.jpg','- 3.6L, 283-hp V6 engine<br />- Sound system with MP3<br />- 3-zone manual air-conditioning<br />- 6-speaker sound system','27020','17','25','2012-02-16 23:42:48','0000-00-00 00:00:00','6' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '367','vw','Volkswagen','Golf','GOLFBIG.jpg','golf.jpg','- 2.5L, 170 hp, cylinder engine<br />- Power windows<br />- 6 Airbags<br />- Electronic Stability Control (ESC)<br />- Sound system with MP3','17995','23','33','2012-02-16 23:42:48','0000-00-00 00:00:00','5' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '368','vw','Volkswagen','GTI','GTIBIG.jpg','gti.jpg','- Leather-wrapped sport steering wheel<br />- Sound system with MP3<br />- 6 airbags<br />- Electronic Stability Control (ESC)','23995','21','31','2012-02-16 23:42:48','0000-00-00 00:00:00','4' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '369','vw','Volkswagen','Golf-R','GOLFRBIG.jpg','golfr.jpg','- 2.0T Turbocharged Engine w/ 256 Horsepower<br />- 4MOTION all-wheel drive<br />- Top sport seats with leather trimmed seating surfaces<br />- R body kit, R badging','33990','19','27','2012-02-16 23:40:55','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '370','vw','Volkswagen','Eos','EOSBIG.jpg','Eos.jpg','- 2.0L, 200-hp TSI engine<br />- 6 speed DSG Transmission with Tiptronic<br />- Touchscreen Premium VIII sound system<br />- Electronic Stability Control (ESC)','34350','22','29','2012-02-16 23:42:48','0000-00-00 00:00:00','2' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '371','vw','Volkswagen','Beetle','BEETLEBIG.jpg','beetle.jpg','- 2.5L, cylinder engine, 170 hp<br />- Bluetooth technology<br />- Media Device Interface (MDI) with iPod cable<br />- Electronic Stabilization Control (ESC)','19795','22','31','2012-02-16 23:42:48','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '372','audi','Audi','A5 Cabriolet','A5CABBIG.jpg','A5Cabriolet.jpg','- 18\" wheels with all-season tires<br />- Power folding acoustic top<br />- Single-zone automatic climate control<br />- Power front seats with driver lumbar support','42600','22','30','2012-02-16 23:42:50','0000-00-00 00:00:00','13' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '373','audi','Audi','S5','S5BIG.jpg','S5Coupe.jpg','- 19\" cast aluminum alloy wheels with performance tires<br />- Dual-exhaust with quad tailpipes<br />- Audi sound system<br />- Driver memory<br />- BLUETOOTH® mobile phone preparation','53900','14','22','2012-02-16 23:42:50','0000-00-00 00:00:00','12' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '374','audi','Audi','A6','A6BIG.jpg','A6Sedan.jpg','- Drive seat memory<br />- LED taillights<br />- Keyless start<br />- Audi drive select<br />- HomeLink remote transmitter','41700','19','28','2012-02-16 23:42:50','0000-00-00 00:00:00','11' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '375','audi','Audi','A7','A7BIG.jpg','A7Sedan.jpg','- Keyless Start<br />- Audi drive select<br />- HomeLink Remote Transmitter<br />- Heated, twelve-way, power front seats','59250','18','28','2012-02-16 23:42:50','0000-00-00 00:00:00','10' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '376','audi','Audi','A8','A8BIG.jpg','A8Sedan.jpg','- Audi Connect<br />- 18-Way power seats<br />- Audi MMI Navigation<br />- Audi drive select<br />- HomeLink remote transmitter','78750','18','28','2012-02-16 23:42:50','0000-00-00 00:00:00','9' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '377','audi','Audi','Q5','Q5BIG.jpg','Q5SUV.jpg','- 18\" wheels with all-season tires<br />- 211 hp, 2.0L turbocharged 4-cylinder engine<br />- Twelve-way power front seats<br />- Power-adjustable, heated exterior mirrors','35600','20','27','2012-02-16 23:42:50','0000-00-00 00:00:00','8' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '378','audi','Audi','Q7','Q7BIG.jpg','Q7SUV.jpg','- 280hp, 3.0L Supercharged V6<br />- 18\" wheels with all-season tires<br />- Heated, twelve-way power front seats<br />- Seven-passenger seating','46250','16','22','2012-02-16 23:42:50','0000-00-00 00:00:00','7' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '379','audi','Audi','TT','TTBIG.jpg','TTcoupe.jpg','- Leather/Alcantara sport seats<br />- BLUETOOTH mobile phone preparation<br />- Retractable rear spoiler<br />- HomeLink remote transmitter','38300','23','31','2012-02-16 23:42:50','0000-00-00 00:00:00','6' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '380','audi','Audi','TT Roadster','TTROADBIG.jpg','TTRoadster.jpg','- BLUETOOTH mobile phone preparation<br />- Retractable rear spoiler<br />- HomeLink remote transmitter<br />- Power retractable acoustic top','41300','23','31','2012-02-16 23:42:50','0000-00-00 00:00:00','5' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '381','audi','Audi','TTS','TTSBIG.jpg','TTSCoupe.jpg','- Retractable rear spoiler<br />- Audi magnetic ride with sport program<br />- BLUETOOTH mobile phone preparation<br />- HomeLink remote transmitter','47000','23','31','2012-02-16 23:42:50','0000-00-00 00:00:00','4' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '382','audi','Audi','TTS Roadster','TTSROADBIG.jpg','TTSRoadster.jpg','- Retractable rear spoiler<br />- Audi magnetic ride with sport program<br />- BLUETOOTH mobile phone preparation<br />- HomeLink remote transmitter','50000','23','31','2012-02-16 23:40:55','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '383','audi','Audi','R8','R8BIG.jpg','R8Coupe.jpg','- Audi xenon plus headlights with LED daytime running lights<br />- Audi magnetic ride<br />- BLUETOOTH seatbelt microphone<br />- HomeLink remote transmitter','114200','11','20','2012-02-16 23:43:23','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '384','audi','Audi','R8 Spyder','R8SPYDBIG.jpg','R8Spyder.jpg','- Audi magnetic ride<br />- Power folding acoustic top<br />- BLUETOOTH seatbelt microphone<br />- HomeLink remote transmitter','127700','11','20','2012-02-16 23:43:23','0000-00-00 00:00:00','2' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '385','subaru','Subaru','Impreza','imprezabig.jpg','impreza.jpg','- Symmetrical All-Wheel Drive<br />- 4-cylinder SUBARU BOXER engine<br />- Choice of 4- and 5-door body styles<br />- Vehicle Dynamics Control (VDC)','17495','27','36','2012-02-16 23:42:47','0000-00-00 00:00:00','8' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '386','subaru','Subaru','WRX Hatchback','wrxhatchbig.jpg','ImprezaWRX5.jpg','- Symmetrical All-Wheel Drive<br />- Turbocharged 265-hp<br />- Sport-tuned suspension<br />- 17 x 8.0-inch aluminum-alloy wheels<br />- Quad outlet exhausts','25595','19','25','2012-02-16 23:42:47','0000-00-00 00:00:00','7' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '387','subaru','Subaru','WRX','WRXBIG.jpg','imprezawrx.jpg','- Symmetrical All-Wheel Drive<br />- Turbocharged 265-hp<br />- Sport-tuned suspension<br />- 17 x 8.0-inch aluminum-alloy wheels<br />- Quad outlet exhausts','25595','19','25','2012-02-16 23:42:47','0000-00-00 00:00:00','6' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '388','subaru','Subaru','WRX STI','STIBIG.jpg','wrxsti.jpg','- 305-hp SUBARU BOXER engine<br />- Driver Controlled Center Differential (DCCD)<br />- Brembo performance braking system<br />- Bluetooth hands-free phone and audio','34095','17','23','2012-02-16 23:42:47','0000-00-00 00:00:00','5' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '389','subaru','Subaru','Legacy','LEGACYBIG.jpg','legacy.jpg','- Available Lineartronic CVT<br />- Projector-beam headlights<br />- Aerodynamic side ground effects<br />- Vehicle Dynamics Control (VDC)','19995','23','31','2012-02-16 23:43:19','0000-00-00 00:00:00','4' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '390','subaru','Subaru','Outback','OUTBACKBIG.jpg','outback.jpg','- Symmetrical All-Wheel Drive<br />- Available 4-cylinder and 6-cylinder<br />- 8.7 inches of ground clearance<br />- Available Lineartronic CVT<br />- Integrated roof rack','23295','22','29','2012-02-16 23:43:19','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '391','subaru','Subaru','Forester','FORESTERBIG.jpg','forester.jpg','- Symmetrical All-Wheel Drive<br />- 8.9 inches of ground clearance<br />- Vehicle Dynamics Control<br />- Available HID headlights','20595','21','27','2012-02-16 23:42:47','0000-00-00 00:00:00','2' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '392','subaru','Subaru','Tribeca','TRIBECABIG.jpg','Tribeca.jpg','- Symmetrical All-Wheel Drive<br />- 6-cylinder SUBARU BOXER engine<br />- Vehicle Dynamics Control<br />- 4-wheel independent suspension','30595','16','21','2012-02-16 23:42:47','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '393','porsche','Porsche','911 Carrera','911.jpg','911.jpg','- 345 hp @ 6,500 rpm<br />- 0-60 mph: 4.7 s<br />- Top Track Speed: 180 mph','79000','18','26','2012-02-16 23:43:14','2012-02-16 01:00:00','4' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '394','porsche','Porsche','Boxster','boxsterbig.jpg','boxster.jpg','- 255 hp @ 6,400 rpm<br />- 0-60 mph: 5.6 s<br />- Top Track Speed: 163 mph','48100','19','27','2012-02-16 23:43:14','0000-00-00 00:00:00','5' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '395','porsche','Porsche','Cayman','caymanbig.jpg','cayman.jpg','- 265 hp @ 7,200 rpm<br />- 0-60 mph: 5.5 s<br />- Top Track Speed: 165 mph','51900','20','29','2012-02-16 23:43:09','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '396','porsche','Porsche','Cayenne','cayenne.jpg','cayenne.jpg','- 300 hp @ 6,300 rpm<br />- 0-60 mph: 7.1 s<br />- Top Track Speed: 142 mph','48200','16','23','2012-02-16 23:43:17','2012-02-16 01:00:00','2' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '397','porsche','Porsche','Panamera','panamerabig.jpg','panamera.jpg','- 300 hp @ 6,200 rpm<br />- Top Track Speed: 160 mph<br />- 0-60 mph: 6.0 s','74400','18','27','2012-02-16 23:43:17','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '398','maserati','Maserati','GranTurismo','granturismobig.jpg','GranTurismo.jpg','- Displacement: V8, 4244cc<br />- Maximum power output: 405 CV<br />- Maximum torque: 460 Nm<br />- Top speed: 285 km/h<br />- 0- 60: 5.2 sec','123000','13','21','2012-02-16 23:40:55','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '399','maserati','Maserati','Quattroporte','quatbig.jpg','Quattroporte.jpg','- Displacement: V8, 4244 cc<br />- Maximum power output: 400 CV<br />- Maximum torque: 460 Nm<br />- Top speed: 270 km/h<br />- 0-60: 5.6 sec','127250','12','19','2012-02-16 23:43:07','0000-00-00 00:00:00','2' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '400','maserati','Maserati','GranCabrio','grancabriobig.jpg','grancabrio.jpg','- Engine: V8, 4691 cc<br />- Maximum power: 440 bhp @ 7000 rpm<br />- Maximum torque: 490 Nm @ 4750 rpm<br />- Top speed: 283 km/h<br />- 0-60: 5.3 sec','136000','11','18','2012-02-16 23:43:07','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '401','landrover','Land Rover','LR2','landlr2big.jpg','lr2.jpg','- Command Driving Position<br />- Rear seat split<br />- Electric Windows - one touch<br />- Automatic climate control<br />- Panoramic sunroof','36550','15','22','2012-02-17 00:20:40','0000-00-00 00:00:00','0' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '402','landrover','Land Rover','LR4','landlr4big.jpg','lr4.jpg','- Command Driving Position<br />- Seat Height & Lumbar Driver<br />- Leather Steering Wheel<br />- Dual-zone automatic climate control<br />- Cruise control','49750','12','17','2012-02-17 00:20:40','0000-00-00 00:00:00','0' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '403','landrover','Land Rover','Evoque','evoquebig.jpg','rangeroverevoque.jpg','- Climate Control Air Filtration<br />- Interior Auto-Dimming<br />- Interior illumination<br />- Oxford Leather<br />- Push Button Start','43995','19','28','2012-02-17 00:20:40','0000-00-00 00:00:00','0' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '404','landrover','Land Rover','Range Rover','rangeroverbig.jpg','rangerover.jpg','- 12.3 inch Thin Film transistor<br />- Climate Control<br />- Heated leather steering wheel<br />- Front and rear park sensors<br />- Powered driver memory seats','80275','12','18','2012-02-17 00:20:40','0000-00-00 00:00:00','0' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '405','landrover','Land Rover','Range Rover Sport','rangesportbig.jpg','rangeroversport.jpg','- Command Driving Position<br />- Push Button Start<br />- Premium Leather <br />- Interior Mood Light<br />- Memory Pack','60895','12','17','2012-02-17 00:20:40','0000-00-00 00:00:00','0' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '406','bmw','BMW','1 Series','1big.jpg','1.jpg','- BMW ConnectedDrive<br />- Harman Kardon Surround Sound<br />- 6-Speed Steptronic <br />- Also available in: Convertible & M series','31200','18','27','2012-02-17 00:19:28','0000-00-00 00:00:00','9' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '407','bmw','BMW','3 Series','3big.jpg','3.jpg','- Color Heads-up display<br />- Harmon Kardon Surround Sound<br />- BMW Bluetooth<br />- Also Available: Coupe, Convertible & M series','34900','24','36','2012-02-17 00:19:28','0000-00-00 00:00:00','8' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '408','bmw','BMW','5 Series','5big.jpg','5.jpg','- BMW ConnectedDrive<br />- iDrive System<br />- Distance Control<br />- Parking Assist<br />- Also Available: M series','46900','23','34','2012-02-17 00:19:28','0000-00-00 00:00:00','7' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '409','bmw','BMW','6 Series','6big.jpg','6.jpg','- Bang & Olufsen Surround Sound<br />- BMW Bluetooth<br />- Parking Assist<br />- Also Available: Convertible & M series','73600','23','33','2012-02-17 00:19:28','0000-00-00 00:00:00','6' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '410','bmw','BMW','7 Series','7big.jpg','7.jpg','- iDrive<br />- Panel LCD Technology<br />- Rear-view Camera<br />- Blind Spot Detection','71000','17','25','2012-02-17 00:19:28','0000-00-00 00:00:00','5' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '411','bmw','BMW','X3','x3big.jpg','x3.jpg','- BMW ConnectedDrive<br />- Electronic Damping Control<br />- BMW Bluetooth<br />- 8.8 inch display','37100','19','25','2012-02-17 00:19:28','0000-00-00 00:00:00','4' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '412','bmw','BMW','X5','x5big.jpg','x5.jpg','- Panoramic Roof<br />- Navigation System with Traffic Alert<br />- Run-Flat Tires<br />- Dynamic Stability Control<br />- Also Available: M Series','47500','16','23','2012-02-17 00:19:28','0000-00-00 00:00:00','3' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '413','bmw','BMW','X6','x6big.jpg','x6.jpg','- Navigation System with Traffic Alert<br />- BMW Assist <br />- xDrive all wheel drive<br />- Rearview camera<br />- Also Available: M Series','59600','16','23','2012-02-17 00:19:28','0000-00-00 00:00:00','1' );", "INSERT INTO models ( id,make,'make_name',model,image,thumb,features,price,'mpg_city','mpg_hwy','updated_on','created_on',leorder ) VALUES ( '414','bmw','BMW','Z4','z4big.jpg','z4.jpg','- Retractable Hardtop Roof<br />- iDrive System<br />- Rollover Safety System<br />- Run-Flat Tires','48650','24','33','2012-02-17 00:19:28','0000-00-00 00:00:00','2' );",

        // Populate the contacts table, not ready
        'CREATE TABLE IF NOT EXISTS contacts (id integer PRIMARY KEY,first TEXT,last TEXT,email TEXT,phone integer,make TEXT,model TEXT,contact_time timestamp,page TEXT);',
        // "INSERT INTO contacts ( id,first,last,email,phone,make,model,contact_time,page ) VALUES ( '1','john','doe','jdeo@gmail.com','3217507895','Volkswagen','Carmobile','2012-02-10 01:00:00','test' );",

        // Populate the specials table
        "CREATE TABLE IF NOT EXISTS specials (id integer PRIMARY KEY,make text,thumb text,headline text,description text,leorder integer);",
        
        // Populate the versions table
        "CREATE TABLE IF NOT EXISTS versions (id integer UNIQUE PRIMARY KEY,'table_name' text,version integer);", "INSERT INTO versions (id, table_name, version) VALUES (1, 'models', 1);", "INSERT INTO versions (id, table_name, version) VALUES (2, 'specials', 1);"

        ],


        updateTables: function() {

            /*  Unfortunately this function does not download images.
                The reason for this is because it is not possible to say <img src="file:///reeves/car.jpg">
                To add new images, we will have to recompile the app
                    OR perhaps a Java class can be written that is called?
            */

            var alertOn = (arguments[0] === "alert");
            if ( alertOn && (!config.online)) {
                window.alert("Sorry, not connected to internet");
            }

            console.log ("It's time to check for updates");
            
            html5sql.process("SELECT * FROM versions", function(tx, tables) {

                for (var i = 0; i < tables.rows.length; ++i) {
                    table = tables.rows.item(i);
                    decideToUpdate(table);

                }
            }, data.error);


            function decideToUpdate(localTable) {

                $.ajax({
                    type: 'GET',
                    url: 'http://kiosk.reevesimportmotorcars.com/server/tableStatus.php',
                    data: table,
                    success: function(serverTable) {

                console.log(localTable);
                console.log(serverTable);

                        if (serverTable.version !== localTable.version) {
                            console.log("Chose to update: " + serverTable.table_name);
                            data.updateTable(serverTable);
                            if (alertOn) {
                                window.alert("Chose to update: " + serverTable.table_name);
                            }
                        }
                        console.log("Chose NOT to update: " + serverTable.table_name);
                        if (alertOn) {
                            window.alert("Chose NOT to update: " + serverTable.table_name);
                        }
                    },
                    dataType: "jsonp"
                });
            }

        },

        updateTable: function(serverTable) {

            $.ajax({
                type: 'GET',
                url: 'http://kiosk.reevesimportmotorcars.com/server/table_sql.php',
                data: serverTable,
                success: function(response) {
                    console.log("serverTable");
                    console.log(serverTable);
                    console.log("response");
                    console.log(response);

                    html5sql.process(response.sql, function(tx, tables) {
                        
                        console.log("Updated table: " + serverTable.table_name);

                        // Update versions table
                        var updateVersionsTable = "UPDATE versions SET version = '" + serverTable.version + "' WHERE table_name = '" + serverTable.table_name + "' ";
                        
                        html5sql.process(updateVersionsTable, function(tx, tables) {

                            console.log("Succesfuly executed: " + updateVersionsTable);

                        }, data.error);

                    }, data.error);

                },
                dataType: "jsonp"
            });


        }


    };
})();