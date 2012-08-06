
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Reeves Kiosk</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<!-- Le styles -->
	<link href="css/bootstrap.css" rel="stylesheet">
	<link href="css/bootstrap-responsive.css" rel="stylesheet">
	<style>
	  body {
	    padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
	  }
	  input, select, textarea {
	  	display: block !important;
	  }
	</style>
	<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

</head>
<body>
    <div class="container">
    	<div class="row">
    	<div class="span5">
			<form id="addMake">
				<input type="hidden" name="action" value="create"/>
				<select id="make" name="make">
					<option value="audi">Audi</option>
					<option value="vw">Volkswagen</option>
					<option value="subaru">Subaru</option>
					<option value="porsche">Porsche</option>
					<option value="maserati">Maserati</option>
					<option value="landrover">Land Rover</option>
					<option value="bmw"  selected="selected">BMW</option>
				</select>
				<input type="text" value="thumb" name="thumb" style="width: 100%;"/>
				<input type="text" value="headline" name="headline" style="width: 100%;"/>
				<textarea name="description" id="description" style="width: 100%; height: 150px;"></textarea>
				<input type="button" name="submit" class="submit" value="Add Make" />
			</form>
		</div>
		<div class="span6">
			<pre>
				<div class="result"></div>
			</pre>
		</div>
	</div>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>
	<script src="js/app.js"></script>

</body>
</html>