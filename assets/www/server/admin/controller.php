<?php


$action = $_REQUEST['action'];
$make = $_POST['make'];
$thumb = $_POST['thumb'];
$headline = ltrim(trim(kill_newline($_POST['headline'])));
$description = ltrim(trim($_POST['description']));
$description = replace_quotes($description); // the websql crashes if passed even an escaped quotation
$description = replace_newline($description); 

if ($action == 'create') {
	add_model($make, $thumb, $headline, $description);
}

function add_model($make, $thumb, $headline, $description) {
	
	include ('../pw.php');
	$link = mysql_connect($host,$user,$pass);
	mysql_select_db($name,$link);

	$query = "INSERT INTO  `kioskphonegap`.`specials` (
		`id` ,
		`make` ,
		`thumb` ,
		`headline` ,
		`description` ,
		`leorder`
	) VALUES (
		NULL,  
		'" . $make . "',  
		'$thumb',  
		'$headline',  
		'$description',
		NULL
	);";

	echo $query;

	$result = mysql_query($query);

	if ($result === false) {
		echo "<h3>There was an error</h3>";
	}
	else {
		echo "<br /><br />Successfully added to database.";	
	}

}


function kill_newline($str) {
	$order   = array("\r\n", "\n", "\r");
	$replace = '';
	return str_replace($order, $replace, $str);
}
function replace_newline($str) {
	$order   = array("\r\n", "\n", "\r");
	$replace = '<br />';
	return str_replace($order, $replace, $str);
}
function replace_quotes($str) {
	$order   = array("'", '"');
	$replace = '';
	return str_replace($order, $replace, $str);
}

?>