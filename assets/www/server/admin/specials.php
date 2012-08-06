<?php

$host = "localhost";
$name = "kioskphonegap";
$user = "spark";
$pass = "AekZwQy4";

$link = mysql_connect($host,$user,$pass);
mysql_select_db($name,$link);

$action = $_GET['action'];
$make = mysql_real_escape_string($_GET['make']);


switch ($action) {

	case "view":
		viewMake($make);
		break;
	case "add":
		addMake ($make);
		break;
	case "delete":
		$id = mysql_real_escape_string($_GET['id']);
		deleteSpecial($id, $make);
		viewMake($make);
		break;
}


function viewMake($make) {

	$query = "SELECT * FROM specials WHERE make = $make";
	$result = mysql_query($query);

	while($row = mysql_fetch_array($result)) {

		?>

		<ul>
			<li></li>
		</ul>

		<?php



	}


}



?>