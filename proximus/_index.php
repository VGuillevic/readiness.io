<!doctype html>
<html>
<head>
	
<meta charset="UTF-8">
<title>Readiness map - login</title> 
	 
    <link rel="stylesheet" type="text/css" href="tools/reset.css"> 
	
	<style type="text/css">
		
		
		.bg_color { background: #5d338c }
		.form_bg_color { background: #9b70cc }
		.submit_color {  background: #452a63 }
		.bg_logo{ background-image: url(layout/logo_proximus2.png)}
		
		/*
		.bg_color { background: #007bae }
		.form_bg_color { background: #00a7e1 }
		.submit_color {  background: #003564 }
		.bg_logo{ background-image: url(layout/logo_kbc2.png)}
		*/
		
		@import url(http://fonts.googleapis.com/css?family=Exo+2:100,200,300,400,600,700); 
		
		#logo { 
			position: absolute;
			bottom: 300px;
			width: 300px;
			height: 80px;
			background-repeat: no-repeat;
			background-position: center;
		}
		
		form {
			width: 300px;
			height: 260px;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			border-radius: 5px;
			color: #fff;
			text-align: center;
			font-size: 12px;
		}
		
		.mt20{margin-top: 20px;}
		
		input{
			border:none;
			border-radius: 3px;
			width: 240px;
			margin: 5px 0 15px 0;
			padding: 10px 0;
			text-align: center;
		}
		
		#submit{
			border: none;
			border-radius: 3px;
			color: #fff;
			position: absolute;
			bottom: 20px;
			left: 30px;
			padding: 13px 0;
		}
		
		#msg{
			position: absolute;
			bottom: -40px;
			width:300px;
			text-align:center;
		} 
		
	
	</style>
	
</head>
<body class="bg_color"> 
	
	<form action="map.php" method="post" class="form_bg_color">
		
		<div id="logo" class="bg_logo"></div>
		
		<div class="mt20" >LOGIN</div>
		<input name="login" value="" id="login" type="text" />
		<br>
		
		<div >PASSWORD</div>
		<input name="password" value="" id="password" type="password" />
		<br>	
	
		<input id="submit" class="submit_color" type="submit" value="OK"/>
		
		<div id="msg">
		<?php  

		if( isset($_GET["msg"]) && $_GET["msg"] == "error" ){
			print "LOGIN FAILED";
		}	

		?>
		</div>
	
	</form>
	
</body>
</html>
