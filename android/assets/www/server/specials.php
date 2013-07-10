<?php
echo "\n\n";
//header('content-type: application/json; charset=utf-8');

include('pw.php');

$models = get_table_sql($host,$user,$pass,$name,'contacts');
$models = makeArray($models);
$models = json_encode($models);

print_r( $models );


/* backup the db OR just a table */
function get_table_sql($host,$user,$pass,$name,$tables)
{
  
  $link = mysql_connect($host,$user,$pass);
  mysql_select_db($name,$link);
  
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
  return $return;
  
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
  
  $mysql = str_replace(" ENGINE=MyISAM DEFAULT CHARSET=latin1", "", $mysql);
  $mysql = str_replace("ON UPDATE CURRENT_TIMESTAMP", "", $mysql);
  $mysql = str_replace("\n", "", $mysql);

  return $mysql;
}

function makeArray ($string) {
  $string = explode(";", $string);

  // remove empty cells
  foreach ($string as $key => $link)
  {
      if ($string[$key] == '')
      {
          unset($string[$key]);
      }
  }
  return $string;
}

echo "\n\n";

?>