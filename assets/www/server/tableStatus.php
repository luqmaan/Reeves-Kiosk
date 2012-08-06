<?php

	header('content-type: application/json; charset=utf-8');

	include('pw.php');

	$link = mysql_connect($host,$user,$pass);
	mysql_select_db($name,$link);


	$table_name = mysql_real_escape_string( $_REQUEST['table_name'] ); 	
	$version =  mysql_real_escape_string ( $_REQUEST['version'] );

	$query = "SELECT table_name, version FROM versions WHERE table_name = '$table_name'";
	$result = mysql_query($query);

	// echo $query;

	$data = "";

	while($row = mysql_fetch_array($result))
    {
    	$data .= json_encode($row);

    }

	echo $_GET['callback'] . '('.$data.')';

	echo "\n\n";

?>