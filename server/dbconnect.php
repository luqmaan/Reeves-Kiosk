<?php

$host = "localhost";
$dbname = "";
$user = "";
$pass = "";
try {
	global $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
} catch(PDOException $e) {
	echo $e -> getMessage();
}

?>