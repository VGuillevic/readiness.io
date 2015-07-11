
function $_GET() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
} 
	
var client = ( $_GET()["client"] || 'envisioning' );
var get_msg = $_GET()["msg"];
var get_tech = $_GET()["tech"]; 
var get_categ = $_GET()["categ"]; 
var get_slider = $_GET()["slider"];   

$.getScript("_clients/" + client + "/theme.js", function(){ 
	
	var login = window.sessionStorage.getItem('login');
	var password = window.sessionStorage.getItem('password');
	var pass = false;
	
	for(i in theme.users){
		if( login == theme.users[i] && password == theme.user_pw[i] ){
			pass = true;	
			break;
		}
	}
	
	if ( !pass ){ 
	
		var destination = "index.html?msg=LOGIN-FAILED";
		if( get_categ ) destination += "&categ="+get_categ; 
		if( get_tech ) destination += "&tech="+get_tech;
		if( get_slider ) destination += "&slider="+get_slider;

		document.location.href = destination;
	
	}else{ 

		window.onload = function (){    

			// colors //

			var white = '#fff';
			var drk_gray = '#333';
			var sft_gray = '#ccc';   

			// vars 

			var tech_radius_factor = 5; 

			var location = window.location.href.split("?")[0];
			var win_w;
			var win_h;

			var med_w;
			var med_h; 

			var dur = 250; // default duration for animations
			var dur3 = 500; 
			var dur2 = 750; 
			var ease = "easeOutQuart"; 
			var op_down = .3 // opacity down
			var op_low = .15  
			var op_up = .8; // opacity up

			var filter_lock = false; 

			var readiness_mod = 60; 

			var innovation_scale = 1;
			var evolution_scale = 1;

			var slider_x = 150;

			// json vars 

			var json;
			var json_target;
			var i;
			var a;
			var b;

			var node;
			var _node;
			var __node;
 
			var cur_node = null;  

			// map vars 

			var tech_container;
			var tech;
			var n_techs;
			var tech_radius;
			var tech_angle;
			var tech_delay;
			var tech_dist;
			var tech_circle;
			var tech_label;
			var techs_max_dist = 120; 
			var tech_min_dist = 30;  

			var subconnections = [];

			var angle_pos;

			// list vars

			var itm;
			var itm_img;
			var itm_lb; 

			var search_tx;

			var search_list_h; 
			var list_div_h = 42;

			var filter_h = 36;
			var filters_h;
			var cur_categ = -1; 

			var starred = [];
			var only_starred = false; 

			///////////////////////// OBJECTS /////////////////////////

			var container = document.getElementById("container");  

			var categ_lb = document.getElementById("categ_lb"); 
			var categ_lb = document.getElementById("categ_lb");  
			var categ_ico = document.getElementById("categ_ico");  

			var radar = d3.select('#radar');
			var map = d3.select('#map')
			var map_techs = d3.select('#techs'); 
			var connections = d3.select('#connections');

			var logo_client = document.getElementById('logo_client'); 

			var bt_zoom_in = document.getElementById("bt_zoom_in"); 
			var bt_zoom_out = document.getElementById("bt_zoom_out"); 

			// SLIDER 

			var track = document.getElementById("track"); 
			var slider = document.getElementById("slider");  
			var slider_circle = document.getElementById("slider_circle"); 

			var slider_lb_left = document.getElementById("slider_lb_left"); 
			var slider_lb_right = document.getElementById("slider_lb_right"); 

			// ALERT 

			var alert_msg = document.getElementById("alert_msg"); 
			var alert_yes = document.getElementById("alert_yes"); 
			var alert_no = document.getElementById("alert_no");  

			alert_msg.visible = false;
			alert_yes.return = true;
			alert_no.return = false;

			// SETTINGS 

			var user = document.getElementById('user');
			var user_lb = document.getElementById('user_lb');

			var bt_settings = document.getElementById("bt_settings");
			var bt_settings_timeout; // timeout for close settings

			var curtain = document.getElementById("curtain");
			var settings_list = document.getElementById("settings_list");
			var bt_settings_img = document.getElementById("bt_settings_img"); 
			
			var ico_settings_back = document.getElementById("ico_settings_back"); 
			var ico_settings = document.getElementById("ico_settings"); 

			display_settings.visible = false;

			var settings_bt1 = document.getElementById('settings_bt1');
			var settings_bt2 = document.getElementById('settings_bt2');

			settings_bt1.map = document.getElementById("techs"); 
			settings_bt2.map = document.getElementById("techs") 

			settings_bt1.on = true;
			settings_bt2.on = false; 

			// SEARCH

			var display_search = document.getElementById("display_search");	
			display_search.visible = false;

			var bt_search = document.getElementById("bt_search");
			var ico_search = document.getElementById("ico_search");
			var ico_search_back = document.getElementById("ico_search_back");  
			var search = document.getElementById("search");   
			
			var bt_search_cancel = document.getElementById("bt_search_cancel");
			var ico_search_cancel = document.getElementById("ico_search_cancel");
			
			var search_list = document.getElementById("search_list");
			
			// card

			var cards = document.getElementById("cards");
			var bt_close_card = document.getElementById("bt_close_card");

			var bt_star = document.getElementById("bt_star");
			var card_star = d3.select('#card_star'); 

			var card_img = document.getElementById("card_img");
			var card_name = document.getElementById("card_name");
			var card_description = document.getElementById("card_description");

			var bt_read_more = document.getElementById("bt_read_more");   

			var bt_card_settings = document.getElementById("bt_card_settings"); 
			var bt_card_settings_img = document.getElementById("bt_card_settings_img");

			// OBJECT FUNCTIONS

			logo_client.onclick = function(){
				window.open( theme.url );
			}


			// zoom

			var cur_scale = 1;
			var zoom_limits = [ .5, 8 ];
			var zoom_factor = 1.5;

			var zoomWidth;
			var zoomHeight;

			var clicked_zoom = false; // toggle zoom animation ( +/- buttons and dblclick = true )

			var zoomHandler = d3.behavior.zoom()
								.scaleExtent(zoom_limits)
								.scale(cur_scale)
								.translate([0, 0])
								.on("zoom", zoom)
								.on("zoomend", zoom_end); 

			function zoom_end(){ 
				clicked_zoom = false;
				cur_scale = zoomHandler.scale();
			}

			function zoom_start(){ clicked_zoom = true; }

			function zoom() {
				if( clicked_zoom ){
					map
					.transition().duration(25)
					.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
				}else{
					map
					.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
				}

				if( zoomHandler.scale() > 4 && document.body.className != "macro" ) { 
					document.body.className = "macro";
				}

				if( zoomHandler.scale() <= 4 && document.body.className != "" ) { 
					document.body.className = "";
				}

			} 

			radar.on( "dblclick", zoom_start ).call(zoomHandler);

			bt_zoom_in.onclick = function(){
				if(cur_scale < zoom_limits[1]){
					zoom_start();
					cur_scale *= zoom_factor;
					zoomHandler.scale(cur_scale).event(radar.transition().duration(dur)); 
				}
			}

			bt_zoom_out.onclick = function(){
				if(cur_scale > zoom_limits[0]){
					zoom_start();
					cur_scale = cur_scale/zoom_factor;
					zoomHandler.scale(cur_scale).event(radar.transition().duration(dur));
				}
			} 

			// slider funcs 


			function calc_slider_scales(){
				innovation_scale =  ( slider_x - 150 )/26;
				evolution_scale = -1 * ( slider_x - 150 )/26;
				if( innovation_scale < 1 ) innovation_scale = 1;
				if( evolution_scale < 1 ) evolution_scale = 1; 

				slider_lb_left.style.opacity = Math.max(1.25 - innovation_scale/4, .3);
				slider_lb_right.style.opacity = Math.max(1.25 - evolution_scale/4, .3);  
			}

			$( slider ).draggable({ 
				axis: "x",
				containment: "parent",
				drag: function( event, ui ){  
					slider_x = ui.position.left;
					calc_slider_scales();  
				},
				stop: function( event, ui ) {
					set_slider(ui.position.left, true);			
				}	             
			});

			function set_slider(posx, location){

				slider_x = posx;
				slider.style.left = posx + 'px';

				calc_slider_scales();	 
				bar_total = innovation_scale + evolution_scale;	

				if (slider_x > 130 && slider_x < 170){
					slider_x = 150;
					slider.style.left = "";
					innovation_scale = 1;
					evolution_scale = 1; 
				} 

				if(location) set_location();

				//reorder 

				angle_pos = 0; 

				draw_connections(dur2, dur);

				techs_dist();

			}  


			function calc_val( inov, evol ){
				return ( inov * innovation_scale + evol * evolution_scale);
			}

			function calc_bar_length( val ){
				return val / bar_total * bar_max_length;
			}

			function calc_bar_sep( evol ){
				return evol * evolution_scale / bar_total * bar_max_length;
			} 

			// alert funcs 

			alert_yes.onclick = function(){
				toggle_starred();		
				toggle_alert();		
			}

			alert_no.onclick = function(){
				toggle_alert();		
			}

			// settings funcs 

			bt_settings.onclick = function(){ 
				if( !display_settings.visible ){ 
					open_settings(); 
				}else{ 
					close_settings(); 
				}
			}

			curtain.onclick = function(){
				if( display_settings.visible ){ 
					close_settings();  
				}
			}

			user.onclick = function(){
				if( !display_settings.visible ){ 
					open_settings(); 
				}else{ 
					close_settings(); 
				}
			}; 

			function open_settings(){ 
				display_settings.visible = true;
				$(display_settings).animate({ right:0 }, dur, ease); 
				$(ico_settings).hide();
				$(ico_settings_back).show();
				/*
				$(settings).stop(true).fadeIn(dur);
				change_curtain(op_up);
				bt_settings.style.zIndex = 6; 
				clearTimeout( bt_settings_timeout );
				*/
			}

			function close_settings(){
				display_settings.visible = false; 
				$(display_settings).animate({ right: -390 }, dur, ease);
				$(ico_settings).show();
				$(ico_settings_back).hide();
				/*
				$(settings).stop(true).fadeOut(dur);
				change_curtain(0); 
				bt_settings_timeout = setTimeout( function(){ 
					bt_settings.style.zIndex = "";  
				}, dur);
				*/
			} 
			
			function toggle_setting(){ 
				if(this.on){
					this.on = false;
					this.style.color = theme.bt_label_off;
					this.style.background = theme.bt_bg_off;
					this.innerHTML = "OFF";
					this.map.setAttribute('class', 'lb_off');
				}else{
					this.on = true;
					this.style.color = theme.bt_label_on;
					this.style.background = theme.bt_label_on;
					this.innerHTML = "ON";
					this.map.setAttribute('class', '');
				}
			}

			settings_bt1.onclick = toggle_setting;

			function toggle_starred(){ 
				if(settings_bt2.on){
					settings_bt2.on = false;
					settings_bt2.style.color = theme.bt_label_off;
					settings_bt2.style.background = theme.bt_bg_off;
					settings_bt2.innerHTML = "OFF"; 
					only_starred = false;		
					//startups_map();
				}else{
					settings_bt2.on = true;
					settings_bt2.style.color = theme.bt_label_on;
					settings_bt2.style.background = theme.bt_bg_on;
					settings_bt2.innerHTML = "ON"; 
					only_starred = true;		
					//startups_map(); 
				} 
			}  

			settings_bt2.onclick = toggle_starred;

			// search funcs  

			bt_search.onclick = function(){ 
				if(display_search.visible){
					display_search.visible = false;
					$(display_search).animate( {left: -390 }, dur, ease);
					$(ico_search).show();
					$(ico_search_back).hide(); 
				}else{ 
					display_search.visible = true;
					$(display_search).animate( {left:0}, dur, ease);
					$(ico_search).hide();
					$(ico_search_back).show(); 
				}
			}

			function select_bt(trg, sel){
				trg.selected = sel;
				if(sel){
					trg.lb.style.opacity = 1;	
					if(trg.svg) trg.svg.style.opacity = 1; 
				}else{
					trg.lb.style.opacity = op_down;	
					if(trg.svg) trg.svg.style.opacity = op_down; 
				}
			}

			function reset_bt(trg){ 
				trg.selected = false;
				trg.lb.style.opacity = 1;
				if(trg.svg) trg.svg.style.opacity = 1;
				if(trg.close) $(itm.close).hide();
			}  

			function reset_search(){
				search.value = "";
				search_for("");
				search.input = false; 
				search.value = "";
				$(bt_search_cancel).hide();
			}
			
			bt_search_cancel.onclick = reset_search;

			search.oninput = function(){
				if( this.value != "" ) {
					search.input = true; 
					$(bt_search_cancel).show();
				}else{
					search.input = false; 
					$(bt_search_cancel).hide();
				}
				
				json_target = json.techs; 
				search_for(this.value); 
			}

			function search_for(tx){ 
				search_tx = tx.toUpperCase(); 
				for( i in json_target ){ 
					node = json_target[i];  
					if( node.name.toUpperCase().indexOf( search_tx ) >= 0 && node.visible ){ 
						$(node.itm).show(); 
					}else{ 
						$(node.itm).hide(); 
					}
				}
			}
			
			/*
			
			!!!!! criar icone X no search !!!!!
			
			search_ico.onclick = function(){
				if(search.input){
					reset_search();	
				}else{
					search.focus();	
				} 
			}
			
			*/
			

			bt_read_more.onclick = function(){
				window.open(this.url);
			}


			// card bts 
			bt_close_card.onclick = function() { close_card( true ) }; 
			bt_star.onclick = function() { toggle_star( cur_node ) };  

			// categ bts 
			categ.onclick = function(){
				if( !filter_lock) { 
					if( categ.visible  ){
						close_filter ();
					}else{
						open_filter ();
					}
				}
			}

			function open_filter (){ 
				$(filter_bts).show();
				filter_lock = true;
				categ.visible = true;
				change_curtain( op_up );
				categ_icon.src = "_layout/bt_up_g.png";
				categ_lb.innerHTML = "CHOOSE AN INDUSTRY";

				categ.style.zIndex = 6;

				for( i in json.industries ){
					itm = json.industries[i].itm;	
					itm.style.top = itm.pos - 30 + 'px';
					$(itm).delay(i*24).animate({opacity:1, top:itm.pos + 'px'}, dur, ease );
				} 

				setTimeout( function (){
					filter_lock = false;
				}, dur)

			}

			function close_filter(){  
				if( cur_categ >= 0 ){
					categ.visible = false;
					filter_lock = true;
					change_curtain( 0 );
					$(categ_icon).show();
					categ_icon.src = "_layout/bt_down_g.png";   
					categ_lb.innerHTML = json.industries[cur_categ].name; 

					for(i in json.industries){
						itm = json.industries[i].itm;	
						$(itm).animate( { opacity:0 }, dur3, ease );
					}

					setTimeout( function (){			
						$(filter_bts).hide();
						filter_lock = false;
						categ.style.zIndex = "";
					}, dur3)
				}
			} 

			function set_categ( ID, lock_card ){

				console.log("---------------------------------------------");
				console.log("categ " + ID + " : " + json.industries[ID].name);

				if( ID == cur_categ ){

					close_filter (); 

				} else {

					cur_categ = ID; 
					if( !lock_card ) close_card( true );
					clear_connections();
					filter_lock = true;

					// populate radar 
					//startups_map();

					// close_curtain 
					setTimeout( close_filter, dur2 ); 

				} 
			}

			
			/*
			
			function startups_map(){

				//remove connections
				if( cur_node ) close_card( true );

				n_startups = 0;
				n_techs = 0;

				// reset and hide all techs
				json.techs.forEach( function(d,i) { 
					d.visible = false;
					d.connected = [];
					$(d.itm).hide();
					d.container
							.attr('style','display:none'); 
				});


				// set visibility 
				json.startups.forEach( function(d,i) { 

					if ( d.industries[cur_categ] == 1 && 
						(( only_starred && d.starred ) || ( !only_starred ))){ 

						d.visible = true;
						$(d.itm).show();

						// add techs to visible list
						json.techs.forEach( function(t,a) { 
							if (d.connected.indexOf(t.id) >= 0){ 
								if(!t.visible){
									n_techs ++;
									t.visible = true;
								} 

								t.connected.push(d);
							}
						});

						n_startups++;

					} else {

						d.visible = false;
						d.container
							.attr('style','display:none');

						$(d.itm).hide();

					} 
				});   

				// CHECK n_startups 
				n_startups_lb.innerHTML = n_startups + " <span class='light'>OF</span> " + total_startups + " STARTUPS";

				if ( n_startups == 0 ){ 

					toggle_alert();			 

				} else {

					angle_pos = 0; 

					// built startups map  
					json.startups.forEach( function(d,i) { 

						if( d.visible ){

							startup_angle = angle_pos * 360/n_startups - 90;
							startup_delay = dur2 * ( angle_pos / n_startups );
							startup_length = calc_bar_length ( d.val );
							angle_pos ++; 

							d.container
								.attr('style','')

							d.container
								.attr('stroke-opacity', 0)
								.attr('fill-opacity', 0)

							d.bar
								.attr('x2', 0) 

							d.star
								.attr('transform','scale(0) rotate(' + -startup_angle  + ')')  

							d.container
								.attr('transform','rotate(' + startup_angle + ')')
								.transition().delay(startup_delay).duration(dur2)
									.attr('stroke-opacity',1)
									.attr('fill-opacity', 1) 

							d.bar
								.transition().delay( startup_delay ).duration( dur3 )
								.attr( 'x2', startup_length )

							d.star
								.transition().delay( startup_delay ).duration( dur3 )
								.attr('transform','scale(1) rotate(' + -startup_angle  + ')')   

							if( startup_angle <= 90 ){
								d.label
									.attr('text-anchor','start')	
									.attr('transform','translate( ' + startup_bar_radius + ' 0 ) rotate(0)')  

							}else{
								d.label			
									.attr('text-anchor','end')	
									.attr('transform','translate( ' + startup_bar_radius + ' 0 ) rotate(180)')  
							}

							// store data
							d.angle = startup_angle;
							d.radius = startup_bar_radius;
							d.length = startup_length;

						}
					}); 

					// built techs map 

					angle_pos = 0;

					json.techs.forEach( function(d,i) {   

						if(d.visible){

							tech_radius = calc_radius( d.connected.length ); 
							tech_angle = angle_pos*360/n_techs - 90; 

							$(d.itm).show();

							d.container
								.transition().duration(dur2)
								.attr('transform','rotate(' + tech_angle + ')') 
								.attr('style',''); 

							d.circle
								.transition().duration(dur2)
								.attr('r',tech_radius ); 

							if( tech_angle <= 90 ){  
								d.label 
									.attr('text-anchor','start')
									.attr('style','text-align:left')	
									.transition().duration(dur2)
									.attr('transform','translate(' + tech_radius * 1.5 + ' 0 )') 

							}else{ 
								d.label 
									.attr('text-anchor','end')
									.attr('style','text-align:right')	
									.transition().duration(dur2)
									.attr('transform','translate(' + tech_radius * 1.5 + ' 0 ) rotate(180)')  
							}

							angle_pos++;

							d.angle = tech_angle;
							d.radius = tech_radius;
						}

					});

					techs_dist();
					draw_connections( dur3, true );

				}		
			}
			
			*/


			function techs_dist(){

				json.techs.forEach( function(d,i) {  

					var vals = [];
					var tot = 0;

					for( i in d.connected ){ 
						node = d.connected[i];
						if( node.visible ){
							vals.push( node.length );
							tot += node.length;
						}
					} 

					if(vals.length > 0){
						var med = tot / vals.length;
						d.dist = tech_min_dist + techs_max_dist * med / bar_max_length;  
					}else{
						d.dist = tech_min_dist;
					} 

					d.tech
						.transition().duration(dur2)
						.attr('transform','translate(' + d.dist + ' 0)'); 

				});

			}

			///////////////////////// GENERIC FUNCS /////////////////////////  



			function set_cookie(cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = cname + "=" + cvalue + "; " + expires;
			}

			function get_cookie(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i=0; i<ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1);
					if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
				}
				return "";
			}


			window.onresize = resize;

			function resize(){    

				win_w = $( window ).width();
				win_h = $( window ).height();

				med_w = win_w/2;
				med_h = win_h/2;

				search_list_h = win_h - list_div_h - 20;  
				search_list.style.height = search_list_h + 'px';
				settings_list.style.height = win_h - 20 + 'px';

				cur_scale = 1;
				zoomHandler.translate([med_w, med_h]).scale(1).event(radar); 
				map.attr('transform','translate(' + med_w + ' ' + med_h + ' ) scale(' + cur_scale + ')'); 

			}

			function toggle_alert(){ 
				if(alert_msg.visible){
					alert_msg.visible = false;
					$(alert_msg).fadeOut(dur);
				}else{
					alert_msg.visible = true;
					$(alert_msg).fadeIn(dur);		
				}
			}


			function sort_on(target,attr){
				target.sort(function (a, b) {
					if (a[attr] > b[attr])
					  return 1;
					if (a[attr] < b[attr])
					  return -1;
					if(a[attr] == b[attr]){
						// logic for sub-order (name) is always inverted
						if (a.name > b.name)
						  return -1;
						if (a.name < b.name)
						  return 1;
					}
				});

				if(attr != 'name' ) target.reverse();
			}  


			function log_base(x,b){
				return Math.log(x) / Math.log(b);	
			} 


			function clear_connections(){		
				connections.selectAll("*").remove(); 
				connections.attr( 'stroke-opacity', 0);
			}


			function draw_connections( delay, fade ){ 
				/*
				if( cur_node && cur_node.visible ){

					clear_connections();

					setTimeout( function(){ 

						if( cur_list == 1 ){ 

							for( a in json.startups ){ 
								_node = json.startups[a]; 
								if( _node.connected.indexOf( cur_node.id ) >= 0 && _node.visible ) { 
									 connect( _node, cur_node, .5, white );
								}
							} 

						}else{ 

							for( a in json.techs ){ 
								_node = json.techs[a]; 
								if( cur_node.connected.indexOf( _node.id ) >= 0 ) {	 

									//subconnections
									 for( b in json.startups ){ 
										__node = json.startups[b];
										 if( __node != cur_node && 
											 __node.connected.indexOf( _node.id ) >= 0 &&
											 __node.visible) {	 
												connect( _node, __node, .3, theme.med );
												startup_on(__node, theme.med, white, white ); 
										 } 
									 }

									 //main connection
									 connect( _node, cur_node, .5, white );
								}
							} 
						} 

						connections.transition().duration( fade )
							.attr( 'stroke-opacity', 1 );

					}, delay);
				}
				*/
			}

			function connect( node1, node2, wdt, color ){ 
				connections.append('path')
					.attr( 'stroke', color )
					.attr( 'stroke-width', wdt )
					.attr('stroke-linecap','round')
					.attr( 'fill', 'none' )
					.attr( 'd', spline( [ 
							calc_XY( node1.dist - node1.radius - 1, node1.angle ), 
							{ x:0 , y:0 },
							calc_XY( node2.dist - node2.radius - 1, node2.angle  )
					]));  

			}

			function calc_XY(dist, rot){ 
				var rad = rot*Math.PI/180; 
				var _x = Math.cos(rad)*dist;
				var _y = Math.sin(rad)*dist; 
				return { x:_x , y:_y }; 
			}
 
			function set_location(){  
				var new_loc;
				if( cur_node == null ) new_loc = location + "?categ=" + cur_categ + "&slider=" + slider_x ;
				else new_loc = location + "?categ=" + cur_categ + "&tech=" + cur_node.id + "&slider=" + slider_x;
				history.pushState({page: new_loc}, '', new_loc );
			}
 
			function call_card( ID, push ){ 

				if ( cur_node.id == ID ) {

					close_card( push );

				} else { 

					card_img.className = 'tech_img';  

					json_target = json.techs;

					for( i in json_target ){

						node = json_target[i]; 

						if( node.id != ID ){ 

							tech_off(node); 

						}else{

							cur_node = node; 

							if(cur_node.starred){
								card_star.attr('fill-opacity', 1 )
							}else{
								card_star.attr('fill-opacity', op_down ) 
							}
 
							tech_on( node, white, white, 1 );
							card_name.className = "";  

							card_img.style.backgroundImage = 'url(' + node.img + ')';
							card_name.innerHTML = node.name;

							if( list_id == 1 ){  

								// startup connections  
								for( a in json.startups ){ 
									_node = json.startups[a]; 
									if( _node.connected.indexOf( node.id ) >= 0 ) { 
										startup_on(_node, theme.med, white, white ); 
									}else{ 	  
										startup_off(_node); 
									}
								}  

								card_description.innerHTML = node.description;

							}else{ 

								// tech connections 
								subconnections = [];

								for( a in json.techs ){

									_node = json.techs[a];

									if( node.connected.indexOf( _node.id ) >= 0 ) {	 

										tech_on(_node, theme.med, theme.med, 1 );  
										//subconnections

										for( b in json.startups ){  
											__node = json.startups[b];
											if(	__node != node 
												&& __node.connected.indexOf( _node.id ) >= 0
												&& subconnections.indexOf( node.id ) < 0 ) {
													subconnections.push(__node.id);
											}
										}								

									}else{

										tech_off(_node);

									}
								} 
							}  

							card_data.scrollTop = 0;

							//read more
							bt_read_more.url = node.url; 

							$(cards).animate( { right: -505 }, dur, ease);  
						}
					}

					// set location

					if( push ) set_location ();


				}

				draw_connections(0, dur);

			}


			function tech_off(node){
				node.circle.attr( 'fill', theme.drk );
				node.circle.attr( 'fill-opacity', op_up );
				node.label.attr( 'fill', theme.drk );
			}

			function tech_on(node, color_circ, color_lb, op_circle ){
				node.circle.attr( 'fill', color_circ );  
				node.circle.attr( 'fill-opacity', op_circle );
				node.label.attr( 'fill', color_lb ); 
			} 

			function reset_techs(){
				for ( i in json.techs ){ 
					node = json.techs[i];
					if (node.visible) tech_on(node, theme.med, theme.med, op_up );
				}	
			} 


			function close_card( push ){  
				cur_node = null; 
				if( push ) set_location();
				$(cards).animate( { right: -830 }, dur, ease, function(){ 
					reset_techs(); 		
					clear_connections(); 
				});   
			} 


			function toggle_star( node ){
				if( node.starred ){

					node.starred = false;
					node.star.attr('fill-opacity', op_down ); 
					if( node == cur_node ) card_star.attr('fill-opacity', op_down )

					//if(only_starred) startups_map();

				} else {

					node.starred = true;
					node.star.attr('fill-opacity', 1 );
					if( node == cur_node ) card_star.attr('fill-opacity', 1 )

				}

				save_starred();
			}

			function save_starred(){
				starred = [];
				for( i in json.startups ){
					node = json.startups[i];
					if( node.starred ) starred.push( node.id );
				}
				set_cookie("starred", starred.toString(), 365);
			}

			function change_curtain( op ){
				$(curtain).show();
				$(curtain).stop(true).fadeTo( dur, op, function(){
					if( op == 0 ) $(curtain).hide();
				});	
			} 

			var spline = d3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("basis");


			function dollars(n) {  

				n = n.toString();

				var nr = "";
				var pos = 1;

				for(var p = n.length-1; p>=0; p--){
					nr += n.charAt(p);
					if(pos==3 && p>0){
						nr+=",";
						pos=1;
					}else{
						pos++;
					}
				}  

				return "$" + nr.split("").reverse().join(""); 
			} 

			function check_get( push ){  
				
				get_tech = $_GET()["tech"]; 

				if( get_tech ) call_card( get_tech, push );  
				if( !get_tech ) close_card( push ); 

			}

			window.onpopstate = function () { check_get(false) }; 

			// radar scale  

			function calc_radius(area){
				return Math.sqrt ( area/Math.PI ) * tech_radius_factor; 
			} 

			map_techs.append( 'circle' )
				.attr('cx', 0)
				.attr('cy', 0)	
				.attr('r', tech_min_dist + techs_max_dist )
				.attr('stroke', theme.drk )
				.attr('stroke-width', .1)
				.attr('stroke-opacity',.5)
				.attr('fill', theme.drk)
				.attr('fill-opacity', .3)  

			/////////////////////// load data  

			d3.json("_clients/" + client + "/data.json", function(error, data)  { 

				json = data;

				// default list order: name   
				sort_on( json.techs, 'name' );  

				// categ categ LIST   
				filters_h = filter_h * json.industries.length; 
				filter_bts.style.height = filters_h + 'px'; 

				json.industries.forEach(function(d,i) {  

					itm = document.createElement("div");
					itm.ID = d.id;
					itm.className = 'filter_bt';
					itm.onclick = function (){ 
						if( !filter_lock ){
							set_categ( this.ID, false );  
						}
					}

					itm_lb = document.createElement('div');
					itm_lb.innerHTML = d.name;
					itm_lb.className = 'filter_lb';
					itm.appendChild(itm_lb);
					itm.lb = itm_lb;  

					filter_bts.appendChild(itm);
					json.industries[i].itm = itm; 

					itm.pos = i*filter_h;
					itm.style.top = itm.pos + 'px';
					itm.style.opacity = 0; 

				});

				// TECHNOLOGIES LIST 
				n_techs = json.techs.length;

				json.techs.forEach(function(d,i) { 

					itm = document.createElement("div");
					itm.id = "tech" + d.id;
					itm.ID = d.id;
					itm.className = "itm";
					itm.url = d.url; 

					itm_img = document.createElement("div");
					itm_img.className = "itm_img";
					itm_img.style.backgroundImage = "url(" + d.photo + ")"; 
					itm.appendChild(itm_img);

					itm_lb = document.createElement("div");
					itm_lb.className = "itm_lb";
					itm_lb.innerHTML = d.name;
					itm.appendChild(itm_lb); 

					itm.onclick = function(){ 
						call_card( this.ID, true); 
					}

					d.itm = itm; 
					search_list.appendChild( itm ); 

					//TECHS RADAR

					//store connected startups
					d.connected = [];

					/*
					json.startups.forEach( function( node, a) { 
						if( node.connected.indexOf( d.id ) >= 0 ){
							d.connected.push(node);
						}			
					});
					*/

					tech_radius = calc_radius( d.connected.length );
					tech_angle = i*360/n_techs - 90; 
					tech_delay = i*5;

					tech_container = map_techs.append('g')
						.attr('id','cont_tech' + d.id)
						.attr('x', 0)
						.attr('y', 0)
						//.attr('style','display:none')
						.attr('transform','rotate(' + tech_angle + ')') 
						.on('click', function (){
								call_card( d.id, true );
							})  

					tech = tech_container.append('g')
						.attr('x', 0)
						.attr('y', 0)
						.attr('class', 'tech') 

					tech_circle = tech.append('circle')
						.attr('id','tech_circle' + d.id)
						.attr('cx', 0)
						.attr('cy', 0)	
						//.attr('fill', theme.tech_bg ) 
						.attr('fill', '#f00' ) // category 
						.attr('fill-opacity', op_up ) 
						.attr('stroke','none')
						.attr('r', tech_radius)  

					if( tech_angle <= 90 ){ 

						tech_label = tech.append('text')
							.text(d.name)
							.attr('id','tech_lb'+ d.id)			
							.attr('fill', theme.tech_label ) 
							.attr('class','tech_lb')	
							.attr("dominant-baseline", "central")
							.attr('stroke-width', 0)
							.attr('transform','translate(' + tech_radius * 1.5 + ' 0 )') 

					}else{

						tech_label = tech.append('text')
							.text(d.name)
							.attr('id','tech_lb'+ d.id)	
							.attr('fill', theme.tech_label ) 
							.attr('class','tech_lb')	
							.attr('style','text-align:right')		
							.attr('text-anchor','end')
							.attr('stroke-width', 0)
							.attr("dominant-baseline", "central")
							.attr('transform','translate(' + tech_radius * 1.5 + ' 0 ) rotate(180)') 

					}   

					// store objects
					d.tech = tech;
					d.container = tech_container;
					d.circle = tech_circle;
					d.radius = tech_radius;
					d.angle = tech_angle;
					d.label = tech_label;
					d.dist = tech_min_dist;
					d.visible = true;

				});   

				get_categ = $_GET()["categ"];
				if( get_categ ){ 
					cur_categ = get_categ; 
					$(curtain).hide(); 
					//startups_map();
				}	 

				// permalink check 
				setTimeout ( function(){
					get_slider =  $_GET()["slider"];
					if( get_slider && get_slider != 150 ){				
						set_slider(get_slider, false); 
						setTimeout ( function(){
							check_get(true);
						}, dur2);
					}else{
						check_get(true);
					}

				}, dur2 + dur3); 

			});

			/////////////////////// initial layout  

			resize();
			map.attr("transform", "translate(" + med_w + "," + med_h + ") scale(" + cur_scale + ")"); 

			document.body.style.background = theme.bg; 
			curtain.style.background = theme.curtain;  

			$(filter_bts).hide();  
			$(search).css({color:theme.bt_label_on});

			slider_circle.style.background = theme.slider; 
			title.innerHTML = theme.title;

			settings_bt2.style.color = theme.bt_label_off;
			settings_bt2.style.background = theme.bt_bg_off; 

			logo_client.src = "_clients/" + client + "/logo.png";

			$(alert_msg).fadeOut(0);

			// user data visibility

			/*if(client_id == 1){
				$(user).hide();
				$(settings_guest).hide();
				$(settings_guest_title).hide();
				settings.style.height = '180px';
			}*/



		} 
		
	}
}); 