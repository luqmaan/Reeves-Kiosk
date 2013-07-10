DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (id integer PRIMARY KEY,first TEXT,last TEXT,email TEXT,phone integer,make TEXT,model TEXT,contact_time timestamp,page TEXT);
INSERT INTO contacts ( id,first,last,email,phone,make,model,contact_time,page ) VALUES ( '1','john','doe','jdeo@gmail.com','3217507895','Volkswagen','Carmobile','2012-02-10 01:00:00','test' );

