<?php


//$login = "proximus"; $password = "proximus123"; 
$login = "kbc"; $password = "kbc123";  

//if(1<2){
if(	isset($_POST["login"]) && $_POST["login"] == $login && isset($_POST["password"]) && $_POST["password"] == $password ){

?> 

<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Readiness map</title> 
	
	<script type="text/javascript" src="tools/jquery-2.0.2.min.js"></script>    
	<script type="text/javascript" src="tools/jquery-ui.js"></script>  
	<script type="text/javascript" src="tools/jquery.easing.1.3.js"></script>  
	<script type="text/javascript" src="tools/d3.min.js"></script>    
	<script type="text/javascript" src="map.js" charset="UTF-8"></script> 
	
    <link rel="stylesheet" type="text/css" href="tools/reset.css"> 
    <link rel="stylesheet" type="text/css" href="map.css"> 
	
</head>
<body>
	
	<div id="container">
		
		<div class="bt" id="bt_settings">
			<img id="bt_settings_img" src="layout/bt_settings.png" />
		</div>
		
		<div id="user">
			<span id="user_lb">GUEST</span>
			<img src="layout/bt_user.png" />
		</div>
		
		<img id="logo_client"/>
		
		<div id="settings" style="display:none" >
			 
			<div class="settings_title" > 
				<hr class="hr_l" />
				<span class="settings_title_lb">SETTINGS</span> 
				<hr class="hr_r" />
			</div>   
			
			<div class="setting" >
				STARTUPS LABELS
				<span id="settings_bt1" class="setting_bt">ON</span></div>
			
			<div class="setting" >
				TECHNOLOGIES LABELS
				<span id="settings_bt2" class="setting_bt">ON</span></div>
			
			<div class="setting" >
				SHOW ONLY STARRED STARTUPS 
				<span id="settings_bt3" class="setting_bt">OFF</span></div> 
			
			<div class="settings_title" >  
				<hr class="hr_l" />
				<span class="settings_title_lb">USER</span> 
				<hr class="hr_r" /> 
			</div> 
			
			<div id="settings_guest">
				<div class="setting" >
					E-MAIL
					<input type="text" id="setting_login"/>
				</div>

				<div class="setting" >
					PASSWORD
					<input type="password" id="setting_login"/>
				</div>
				
				<div class="setting_bt2" id="login_user" >LOGIN</div> 
				<div class="setting_link" id="forgot_password" >FORGOT PASSWORD?</div> 
			</div>
			
			<div id="settings_user" >
				thomaz.rezende@gmail.com
				<div class="setting_bt2" id="logout_user" >LOGOUT</div> 
			</div> 
			
		</div> 
		
		<div id="track">
			
			<div id="slider_lb_left">EVOLUTION</div>
			<div id="slider_lb_right">INNOVATION</div>
			
			<div id="slider">
				<div id="slider_circle"></div>
			</div>
			
			<div id="slider_sep">
				<svg width="28" height="10">
					<polygon id="slider_sep_path" stroke="none" points="9,10 14,7 19,10"></polygon>
				</svg>
			</div>
		</div>
		
		<div id="business" style="z-index:6" >
			<img id="business_icon" style="display:none" src="layout/bt_down_g.png"/>
			<span id="business_lb">CHOOSE A BUSINESS MODEL</span>
			<span id="model_lb"></span>
			<div id="n_startups_lb"></div>
		</div>  

		<div id="curtain" ></div>
		<div id="filter_bts"></div>  
		
		<svg id="radar" >
			<g id='map'>
				<g id='techs' ></g>
				<g id='startups' ></g>
				<g id='connections'></g>
			</g> 
		</svg>

		<div class="bt" id="bt_zoom_in"><img src="layout/bt_zoom_in.png" /></div>
		<div class="bt" id="bt_zoom_out"><img src="layout/bt_zoom_out.png" /></div>
		
		<div id="list_container">
			
			<div class="bt" id="bt_search"><img id="bt_search_img" src="layout/bt_search.png" /></div>
				
			<div class="list_div" id="list_type" >
				<div class="list_bt list_bt1" id="list_type_bt1" >
					<span id="list_type_lb1" class="label">TECHNOLOGIES</span>
					<svg  id="list_type_svg1" width="30px" height="30px" viewBox="0 0 36 36">
						<path fill="#333333" d="M27.8,14.9l-0.3-0.3c-0.3-0.4-1-0.5-1.4-0.3c-0.1,0-0.2-0.1-0.3-0.2c-0.2-0.2-0.2-0.5-0.2-0.8
		c0-0.4,0-0.8-0.3-1.1l-1.5-1.5c-0.6-0.6-2-2-4.8-2c-0.9,0-1.9,0.1-2.9,0.4c-0.2,0.1-0.4,0.3-0.4,0.5l0,0.6c0,0.3,0.2,0.5,0.5,0.5
		c0.1,0,2.2,0,3.8,1.5c0.1,0.1,0.3,0.4,0,0.6c-0.1,0.2-0.2,0.2-0.2,0.2l-9.4,9.2C10.1,22.6,10,23,10,23.5c0,0.4,0.2,0.8,0.4,1l1,1.1
		c0.3,0.3,0.7,0.4,1.1,0.4c0.4,0,0.8-0.2,1.1-0.5l8.6-9.4c0,0,0.4-0.4,0.6-0.6c0,0,0.1-0.1,0.2-0.1c0.3,0,0.6,0.2,0.8,0.4
		c0.2,0.2,0.2,0.3,0.3,0.4c0,0,0,0,0,0c-0.3,0.4-0.1,1.1,0.2,1.4l0.3,0.4c0.5,0.5,1.3,0.5,1.8,0l1.4-1.5
		C28.3,16.1,28.3,15.4,27.8,14.9z" />
					</svg>
				</div>
				<div class="list_bt list_bt2" id="list_type_bt2" >
					<span id="list_type_lb2" class="label">STARTUPS</span>
					<svg id="list_type_svg2" width="30px" height="30px" viewBox="0 0 36 36">
						<path fill="#333333" d="M25.9,10.1C25.8,10,25.8,10,25.7,10c-1.7,0-3.1,0.2-4.2,0.7S19.2,12,18,13.2c-0.5,0.5-1.1,1.2-1.7,1.9
			l-3.7,0.2c-0.1,0-0.2,0.1-0.3,0.2L10,19.3c-0.1,0.1-0.1,0.3,0,0.4l0.6,0.6c0.1,0.1,0.1,0.1,0.2,0.1h0.1l2.7-0.8l2.8,2.8L15.7,25
			c0,0.1,0,0.2,0.1,0.3l0.6,0.6c0.1,0.1,0.1,0.1,0.2,0.1s0.1,0,0.2,0l3.8-2.2c0.1-0.1,0.1-0.2,0.2-0.3l0.2-3.7
			c0.7-0.6,1.4-1.2,1.9-1.7c1.2-1.2,2-2.3,2.5-3.5s0.7-2.6,0.7-4.2C26,10.2,26,10.2,25.9,10.1z M23.5,13.8c-0.2,0.2-0.4,0.3-0.7,0.3
			c-0.3,0-0.5-0.1-0.7-0.3s-0.3-0.4-0.3-0.7s0.1-0.5,0.3-0.7c0.2-0.2,0.4-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3s0.3,0.4,0.3,0.7
			C23.8,13.4,23.7,13.6,23.5,13.8z"/>
					</svg>
				</div>
			</div>
 
			<div class="list_div" id="search_container">
				<img id="search_ico" src="layout/bt_search.png" style="opacity:.2"/>
				<input id="search" value="SEARCH"/>
			</div>
			
			<div id="list1"></div>
			<div id="list2"></div>

		</div> 

		<div id="cards">
			
			<div class="bt" id="bt_close_card"><img src="layout/bt_close1.png"/></div>
			
			<div class="bt" id="bt_card_settings">
				<img id="bt_card_settings_img" src="layout/bt_plus.png" />
			</div>
			
			<div class="card" id="startup_data" style="margin-right:15px">
				
				<div id="card_img"></div>

				<div id="card_data">
					<div id="card_ico_lb"></div>
					<div id="card_ico">
						<svg width="25px" height="25px" viewBox="0 0 36 36">
							<path id="card_ico1" fill="#333333" d="M27.8,14.9l-0.3-0.3c-0.3-0.4-1-0.5-1.4-0.3c-0.1,0-0.2-0.1-0.3-0.2c-0.2-0.2-0.2-0.5-0.2-0.8
				c0-0.4,0-0.8-0.3-1.1l-1.5-1.5c-0.6-0.6-2-2-4.8-2c-0.9,0-1.9,0.1-2.9,0.4c-0.2,0.1-0.4,0.3-0.4,0.5l0,0.6c0,0.3,0.2,0.5,0.5,0.5
				c0.1,0,2.2,0,3.8,1.5c0.1,0.1,0.3,0.4,0,0.6c-0.1,0.2-0.2,0.2-0.2,0.2l-9.4,9.2C10.1,22.6,10,23,10,23.5c0,0.4,0.2,0.8,0.4,1l1,1.1
				c0.3,0.3,0.7,0.4,1.1,0.4c0.4,0,0.8-0.2,1.1-0.5l8.6-9.4c0,0,0.4-0.4,0.6-0.6c0,0,0.1-0.1,0.2-0.1c0.3,0,0.6,0.2,0.8,0.4
				c0.2,0.2,0.2,0.3,0.3,0.4c0,0,0,0,0,0c-0.3,0.4-0.1,1.1,0.2,1.4l0.3,0.4c0.5,0.5,1.3,0.5,1.8,0l1.4-1.5
				C28.3,16.1,28.3,15.4,27.8,14.9z" /> 
							<path id="card_ico2" fill="#333333" d="M25.9,10.1C25.8,10,25.8,10,25.7,10c-1.7,0-3.1,0.2-4.2,0.7S19.2,12,18,13.2c-0.5,0.5-1.1,1.2-1.7,1.9
				l-3.7,0.2c-0.1,0-0.2,0.1-0.3,0.2L10,19.3c-0.1,0.1-0.1,0.3,0,0.4l0.6,0.6c0.1,0.1,0.1,0.1,0.2,0.1h0.1l2.7-0.8l2.8,2.8L15.7,25
				c0,0.1,0,0.2,0.1,0.3l0.6,0.6c0.1,0.1,0.1,0.1,0.2,0.1s0.1,0,0.2,0l3.8-2.2c0.1-0.1,0.1-0.2,0.2-0.3l0.2-3.7
				c0.7-0.6,1.4-1.2,1.9-1.7c1.2-1.2,2-2.3,2.5-3.5s0.7-2.6,0.7-4.2C26,10.2,26,10.2,25.9,10.1z M23.5,13.8c-0.2,0.2-0.4,0.3-0.7,0.3
				c-0.3,0-0.5-0.1-0.7-0.3s-0.3-0.4-0.3-0.7s0.1-0.5,0.3-0.7c0.2-0.2,0.4-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3s0.3,0.4,0.3,0.7
				C23.8,13.4,23.7,13.6,23.5,13.8z"/>
					</svg> 
				</div>
					
				<div id="bt_star">
					<svg width='36px' height='36px'>
						<polygon id="card_star" fill="#333" points="18,10.5 20.4,15.4 26,16.2 22,20.1 23,25.5 18,22.9 13,25.5 14,20.1 10,16.2 15.6,15.4 	"/>
					</svg>
				</div>
				
				<div id="card_name"></div>
				<div id="card_founder">FOUNDER <span id="founder_name" class="bold"></span></div>
				<div id="card_location"></div>
				<div id="card_description"></div>
				
			</div>
				
			<div class="bt_card_bottom" id="bt_read_more">
				<span class="label">READ MORE</span>
				<img id="read_more_ico" src="layout/bt_link.png" />
			</div>
 
		</div>
		
		<div class="card" id="startup_models">
			
			<div  class="bt_card_bottom">
				<span class="label">SAVE CHANGES</span>
			</div>   
			
		</div> 
			
		<div class="card" id="startup_comments">
			
			<div  class="bt_card_bottom">
				<span class="label">NEW COMMENT</span>
			</div>   
			
		</div>  
			
	</div>  
	
</body>
</html>
	
<?php 
	
	}else{
			
		header('Location:index.php?msg=error');	 
	
	}
	
?>
