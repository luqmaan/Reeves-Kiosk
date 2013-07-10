<?php
header('content-type: application/json; charset=utf-8');

$table = strtolower($_REQUEST['table_name']);

if ($table == 'contacts')
  die();

$host = "localhost";
$name = "";
$user = "";
$pass = "";

$sql = get_table_sql($host,$user,$pass,$name,$table);


$sql = array (
  "sql" =>  $sql
);

$data = json_encode($sql);


echo $_GET['callback'] . '('.$data.')';


/* backup the db OR just a table */
function get_table_sql($host,$user,$pass,$name,$tables)
{
  
  $link = mysql_connect($host,$user,$pass);
  mysql_select_db($name,$link);
  
  // for use in json
  mysql_query('SET CHARACTER SET utf8');

  //get all of the tables
  if($tables == '*')
  {
    $tables = array();
    $result = mysql_query('SHOW TABLES');
    while($row = mysql_fetch_row($result))
    {
      $tables[] = $row[0];
    }
  }
  else
  {
    $tables = is_array($tables) ? $tables : explode(',',$tables);
  }
  
  //cycle through
  foreach($tables as $table)
  {
    $result = mysql_query('SELECT * FROM '.$table);
    $num_fields = mysql_num_fields($result);
    
    $return.= 'IF EXISTS '.$table. ' DROP TABLE '.$table.';';
    $row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
    $return.= "\n\n".$row2[1].";\n\n";
    
    for ($i = 0; $i < $num_fields; $i++) 
    {
      while($row = mysql_fetch_row($result))
      {
        $return.= 'INSERT INTO '.$table.' VALUES(';
        for($j=0; $j<$num_fields; $j++) 
        {
          $row[$j] = addslashes($row[$j]);
          $row[$j] = ereg_replace("\n","\\n",$row[$j]);
          if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } else { $return.= '""'; }
          if ($j<($num_fields-1)) { $return.= ','; }
        }
        $return.= ");\n";
      }
    }
    $return.="\n\n\n";
  }
  $return = cleanMySQL($return);
  return (string) $return;
  
  //save file
/*  $handle = fopen('db-backup-'.time().'-'.(md5(implode(',',$tables))).'.sql','w+');
  fwrite($handle,$return);
  fclose($handle); */
}

function cleanMySQL ($mysql) {
  /* makes it SQLite friendly
 
    - rename drop table
      IF EXISTS specials DROP TABLE specials;
      DROP TABLE IF EXISTS specials;
    - remove options
      ENGINE=MyISAM DEFAULT CHARSET=latin1;
    - convert each whitespace item into an array
  */

  // IF EXISTS specials DROP TABLE specials;
  $endOfDropLine = strpos ($mysql, ";") + 1;
  $dropPos = strpos($mysql, " DROP") - 10;
  $table = substr($mysql, 10, $dropPos);
  $mysql = substr($mysql, $endOfDropLine);
  $mysql = "DROP TABLE IF EXISTS " . $table . ";" . $mysql;

  // Remove string: ENGINE=MyISAM AUTO_INCREMENT=416 DEFAULT CHARSET=latin1
  $a = strpos ($mysql, "ENGINE=MyISAM");
  $b = strpos($mysql, "DEFAULT CHARSET=latin1");
  $options =  substr($mysql, $a, ($b - $a + 22));
  $mysql = str_replace($options, "", $mysql);

  $mysql = str_replace("ON UPDATE CURRENT_TIMESTAMP", "", $mysql);
  $mysql = str_replace("AUTO_INCREMENT", "", $mysql);
  $mysql = str_replace("\n", "", $mysql);

  return $mysql;
}

?>