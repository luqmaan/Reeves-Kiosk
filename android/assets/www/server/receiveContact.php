<?

header('content-type: application/json; charset=utf-8');


$i = 0;
while (isset($_REQUEST[$i])) {

	saveContact ($_REQUEST[$i]);
	sendCRMEmail ($_REQUEST[$i]);

	$i++;
}

echo $_REQUEST['callback'] . '('.json_encode($data).')';

function saveContact($contact) {

	include('pw.php');

	$link = mysql_connect($host,$user,$pass);
	mysql_select_db($name,$link);

	foreach ($contact as $key => $item) {
		$contact[$key] = mysql_real_escape_string($contact[$key]);
	}

	$query = "INSERT INTO `contacts` (`first`, `last`, `email`, `phone`, `make`, `model`, `contact_time`, `page`)
				VALUES ('" . $contact['first'] . "', '" . $contact['last'] . "', '" . $contact['email'] . "', '" . $contact['phone'] . "', '" . $contact['make'] . "', '" . $contact['model'] . "', '" . $contact['contact_time'] . "', '" . $contact['page'] . "')";

	// echo $query;

	$result = mysql_query($query);

}


function sendCRMEmail($contact) {
	if ($page == 'test') {
		$to = 'reevescrm@drivereeves.com';

		$subject = "Kiosk Test Drive";
	//	$message = "$first $last sent a test drive request from the Reeves kiosk in International Mall.\n\n";
	}
	else {
		$to = 'reevescrm@drivereeves.com';
			
		$subject = "Kiosk Contact Us";
	//	$message = "$first $last sent a contact request from the Reeves kiosk in International Mall.\n\n";	
	}

	// $message .= "First Name: $first \nLast Name: $last \nEmail: $email \nPhone Number: $phone\nMake: $make\nModel: $model \nDate: $time";

	$adf = "<?ADF version=\"1.0\"?>\r\n<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<adf>\r\n     <prospect>\r\n          <id sequence=\"1\" source=\"Reeves Import Motorcars\">99</id>\r\n          <requestdate>2012-02-17T13:45:06</requestdate>\r\n          <vehicle interest=\"test-drive\">\r\n               <year />\r\n               <make>" . $contact['make'] . "</make>\r\n               <model>" . $contact['model'] . "</model>\r\n               <colorcombination>\r\n                    <interiorcolor />\r\n                    <exteriorcolor />\r\n                    <preference>1</preference>\r\n               </colorcombination>\r\n          </vehicle>\r\n          <customer>\r\n               <contact>\r\n                    <name part=\"first\" type=\"individual\">" . $contact['first'] . "</name>\r\n                    <name part=\"last\" type=\"individual\">" . $contact['last'] . "</name>\r\n                    <name part=\"full\" type=\"individual\">" . $contact['first'] . " " . $contact['last'] . "</name>\r\n                    <email preferredcontact=\"0\">" . $contact['email'] . "</email>\r\n                    <phone desc=\"Phone\">" . $contact['phone'] . "</phone>\r\n                    <address>\r\n                         <street line=\"1\" />\r\n                         <city />\r\n                         <regioncode />\r\n                         <postalcode />\r\n                    </address>\r\n               </contact>\r\n               <comments></comments>\r\n          </customer>\r\n          <vendor>\r\n               <nettrak>\r\n                    <nettrak>\r\n                         <id>99</id>\r\n                    </nettrak>\r\n               </nettrak>\r\n               <id sequence=\"1\" source=\"Reeves Import Motorcars\">1</id>\r\n               <vendorname>Reeves Import Motorcars</vendorname>\r\n               <contact>\r\n                    <name part=\"full\">Reeves Import Motorcars</name>\r\n                    <phone type=\"voice\">813.933.2811</phone>\r\n               </contact>\r\n          </vendor>\r\n          <provider>\r\n               <id source=\"Reeves Import Motorcars\" />\r\n               <name>SPARK</name>\r\n               <service>SPARK Kiosk</service>\r\n               <contact>\r\n                    <name>SPARK</name>\r\n                    <phone type=\"voice\">813.253.0300</phone>\r\n               </contact>\r\n          </provider>\r\n     </prospect>\r\n</adf>";


	mail($to, $subject, $adf);
}

?>