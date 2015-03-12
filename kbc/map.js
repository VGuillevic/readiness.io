	
	function $_GET() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}

	var get_tech = $_GET()["tech"];
	var get_startup = $_GET()["startup"];  
	var get_model = $_GET()["model"]; 
	var get_slider = $_GET()["slider"];

	//login

	var client_id = 0;
	var clients = [	["kbc","https://www.kbc.com","kbc123"],
					["proximus","http://www.proximus.be/","proximus123"]];   

	if (window.sessionStorage.getItem('login') != clients[client_id][0] || window.sessionStorage.getItem('password') != clients[client_id][2] ){ 

		var destination = "index.html?msg=LOGIN-FAILED";
		if( get_model ) destination += "&model="+get_model;
		if( get_startup ) destination += "&startup="+get_startup; 
		if( get_tech ) destination += "&tech="+get_tech;
		if( get_slider ) destination += "&slider="+get_slider;

		document.location.href = destination;
	}




window.onload = function (){ 
	
	// layout ajsutments
	
	var tech_radius_factor = 5;
	var bar_max_length = 150; // AJUST BAR SIZE
	 
	// vars  
	
	var location = window.location.href.split("?")[0];
	
	var white = '#fff';
	var drk_gray = '#333';
	var sft_gray = '#ccc';
	
	var colors = [ "#007bae", "#5d338c" ];
	var colors_med = [ '#00a7e1', '#9b70cc' ]; 
	var colors_brg = [ '#78dcff', '#62b0de' ];
	var colors_drk = [ '#003564', '#452a63' ];
		
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
	
	var bar_total = 2;
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
	var list;
	
	var cur_list = null; 
	var cur_node = null;  
	
	var startup_card_sub = [["founding year","year"],
							["headquarter","hq"],
							["country","country"],
							["state","state"],
							["city","city"],
							["company type","type"],
							["business model","model"],
							["partnerships","partnerships"],
							["investors","investors"],
							["notes","notes"],
							["total Funding (USA)","funding"],
							["funding rounds","rounds"],
							["headcount","headcount"]];
	
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
	
	var startup_container;
	var star;
	var startup;
	var n_startups;
	var total_startups;
	var startup_angle;
	var startup_length;
	var startup_delay;
	var startup_bar;
	var startup_sep;
	var startup_lb;
	var startup_dist;
	var startup_bar_radius = 6; 
	var startups_ring = 200;
		
	var list_visible = 2; // startups list = default 
	
	var subconnections = [];
	
	var angle_pos;
	
	// list vars
	
	var itm;
	var itm_img;
	var itm_lb;
	var itm_bars;
	var bar;
	
	var search_tx;
	
	var list_w = 370;
	var list_h;
	var list_hc;
	var list_div_h = 36;
	var list_div_n = 3;
	
	var filter_h = 40;
	var filters_h;
	var cur_model = -1; 
	
	var starred = [];
	var only_starred = false;
	
	var list_lbs = [ null,
					[ "techs", "tech" ],
					[ "startups", "startup" ]]; 
	
	
	///////////////////////// OBJECTS /////////////////////////
	
	var container = document.getElementById("container");  
	
	var model_lb = document.getElementById("model_lb"); 
	var n_startups_lb = document.getElementById("n_startups_lb");
	var business_lb = document.getElementById("business_lb");  
	var business_ico = document.getElementById("business_ico");  
	  
	var radar = d3.select('#radar');
	var map = d3.select('#map')
	var map_techs = d3.select('#techs');
	var map_startups = d3.select('#startups');
	var connections = d3.select('#connections');
	 
	var logo_client = document.getElementById('logo_client'); 
	
	var bt_zoom_in = document.getElementById("bt_zoom_in"); 
	var bt_zoom_out = document.getElementById("bt_zoom_out"); 
	
	// SLIDER 
	
	var track = document.getElementById("track"); 
	var slider = document.getElementById("slider"); 
	var slider_sep = document.getElementById("slider_sep");  
	var slider_sep_path = document.getElementById("slider_sep_path");  
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
	var settings = document.getElementById("settings");
	var bt_settings_img = document.getElementById("bt_settings_img"); 
	
	settings.visible = false;
	$(settings).hide();
	
	var settings_bt1 = document.getElementById('settings_bt1');
	var settings_bt2 = document.getElementById('settings_bt2');
	var settings_bt3 = document.getElementById('settings_bt3'); 
	
	settings_bt1.map = document.getElementById("startups"); 
	settings_bt2.map = document.getElementById("techs") 
	
	settings_bt1.on = true;
	settings_bt2.on = true;
	settings_bt3.on = false;
	
	var settings_guest = document.getElementById("settings_guest");
	var settings_guest_title = document.getElementById("settings_guest_title");
	var settings_user = document.getElementById("settings_user"); 
	
	var login_user = document.getElementById('login_user')
	var logout_user = document.getElementById('logout_user')  
	
	// SEARCH
	
	var list_container = document.getElementById("list_container");	
	list_container.visible = false;
	
	var list1 = document.getElementById("list1");
	var list2 = document.getElementById("list2");	
	var bt_search = document.getElementById("bt_search");
	
	var search = document.getElementById("search");
	var search_ico = document.getElementById("search_ico");
	var bt_search_img = document.getElementById("bt_search_img");  
	
	var list_type_bt1 = document.getElementById("list_type_bt1");
	var list_type_bt2 = document.getElementById("list_type_bt2");
	
	list_type_bt1.lb = document.getElementById("list_type_lb1");
	list_type_bt2.lb = document.getElementById("list_type_lb2");
	
	list_type_bt1.svg = document.getElementById("list_type_svg1");
	list_type_bt2.svg = document.getElementById("list_type_svg2");
	
	var list1 = document.getElementById("list1");
	var list2 = document.getElementById("list2"); 
	
	// card
	
	var cards = document.getElementById("cards");
	var bt_close_card = document.getElementById("bt_close_card");
	
	var bt_star = document.getElementById("bt_star");
	var card_star = d3.select('#card_star');
	
	var card_ico1 = document.getElementById("card_ico1");
	var card_ico2 = document.getElementById("card_ico2");
	var card_ico_lb = document.getElementById("card_ico_lb");
	
	var card_img = document.getElementById("card_img");
	var card_name = document.getElementById("card_name");
	var card_description = document.getElementById("card_description");
	
	var bt_read_more = document.getElementById("bt_read_more");   
	
	var bt_card_settings = document.getElementById("bt_card_settings"); 
	var bt_card_settings_img = document.getElementById("bt_card_settings_img");
	
	// OBJECT FUNCTIONS
	
	logo_client.onclick = function(){
		window.open( clients[client_id][1] );
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
		
		slider_sep.style.left = 100 + (100 - slider_x/3) + "px";

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

			slider_sep.style.left = "";
		} 
		
		if(location) set_location();

		// update bars val

		json.startups.forEach( function( d,i ) { 
			d.val = calc_val( d.innovation, d.evolution ); 
		}); 

		//reorder 

		sort_on( json.startups, "val" ); 

		angle_pos = 0; 

		draw_connections(dur2, dur); 

		json.startups.forEach( function( d,i ) {  

			if( d.visible ){ 

				startup_angle = angle_pos * 360 / n_startups - 90;  
				startup_length = calc_bar_length( d.val );

				d.container
					.transition().duration(dur2)
					.attr('transform','rotate(' + startup_angle + ')');  

				d.star						
					.transition().duration(dur2)
					.attr( 'transform', 'rotate(' + -startup_angle + ')');  

				d.container
					.transition().duration(dur2)
					.attr('transform','rotate(' + startup_angle + ')'); 

				d.bar
					.transition().duration(dur2)
					.attr( 'x2', startup_length );  

				d.sep
					.transition().duration(dur2)
					.attr( 'transform', 'translate(' + calc_bar_sep( d.evolution ) + ' ' + (startup_bar_radius - 1.3 ) + ')'); 

				// ajust startup radar label 

				if( startup_angle <= 90  ){
					d.label
						.attr('text-anchor','start')	
						.attr('transform','translate( ' + startup_bar_radius + ' 0 ) rotate(0)') 
				}else{ 
					d.label
						.attr('text-anchor','end')	
						.attr('transform','translate( ' + startup_bar_radius + ' 0 ) rotate(180)')  
				}   

				// store new data 
				d.angle = startup_angle; 
				d.length = startup_length;

				angle_pos++
			}

		}); 

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
		if( !settings.visible ){ 
			open_settings(); 
		}else{ 
			close_settings(); 
		}
	}
	
	curtain.onclick = function(){
		if( settings.visible ){ 
			close_settings();  
		}
	}
	
	user.onclick = function(){
		if( !settings.visible ){ 
			open_settings(); 
		}else{ 
			close_settings(); 
		}
	}; 
	
	function open_settings(){
		settings.visible = true;
		$(settings).stop(true).fadeIn(dur);
		change_curtain(op_up);
		bt_settings_img.src = "layout/bt_close1.png";
		bt_settings.style.zIndex = 6;
		user.style.zIndex = 6;

		clearTimeout( bt_settings_timeout );
	}
	
	function close_settings(){
		settings.visible = false;
		$(settings).stop(true).fadeOut(dur);
		change_curtain(0);
		bt_settings_img.src = "layout/bt_settings.png";		

		bt_settings_timeout = setTimeout( function(){ 
			bt_settings.style.zIndex = ""; 
			user.style.zIndex = ""; 
		}, dur);
	}
		 
	
	function toggle_setting(){
		
		if(this.on){
			this.on = false;
			this.style.color = colors_med[client_id];
			this.style.background = colors_drk[client_id];
			this.innerHTML = "OFF";
			this.map.setAttribute('class', 'lb_off');
		}else{
			this.on = true;
			this.style.color = "";
			this.style.background = "";
			this.innerHTML = "ON";
			this.map.setAttribute('class', '');
		}
	} 
	
	settings_bt1.onclick = toggle_setting;
	settings_bt2.onclick = toggle_setting;
	
	function toggle_starred(){ 
		
		if(settings_bt3.on){
			settings_bt3.on = false;
			settings_bt3.style.color = colors_med[client_id];
			settings_bt3.style.background = colors_drk[client_id];
			settings_bt3.innerHTML = "OFF";
			
			only_starred = false;			
			startups_map();
			
		}else{
			settings_bt3.on = true;
			settings_bt3.style.color = "";
			settings_bt3.style.background = "";
			settings_bt3.innerHTML = "ON";
						
			only_starred = true;			
			startups_map(); 
		} 
	}  
	
	settings_bt3.onclick = toggle_starred;  
	
	login_user.onclick = login;
	logout_user.onclick = logout;
	
	function login(){ 
		settings.style.height = "330px";
		$(settings_user).show();
		$(settings_guest).hide();
		user_lb.innerHTML = "thomaz.rezende@gmail.com ";
		$(bt_card_settings).show();
	}
	
	function logout(){ 
		settings.style.height = "";
		$(settings_user).hide();
		$(settings_guest).show(); 
		user_lb.innerHTML = "GUEST";
		$(bt_card_settings).hide();
	}
	 
	
	// search funcs  
	
	bt_search.onclick = function(){ 
		if(list_container.visible){
			list_container.visible = false;
			$(list_container).animate( {left:( -list_w - 15 )}, dur, ease);
			bt_search_img.src = "layout/bt_search.png";
			list_container.style.zIndex = "";
		}else{ 
			list_container.visible = true;
			$(list_container).animate( {left:0}, dur, ease);
			bt_search_img.src = "layout/bt_close1.png";
			list_container.style.zIndex = 3;
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
	
	search.onfocus = function(){
		if(this.value == "SEARCH"){
			this.value = "";
		}
		this.style.opacity = 1;
		search_ico.style.opacity = 1;
	}
		
	search.onblur = function(){ 
		if( this.value == "SEARCH" || this.value == "" ){ 
			reset_search();
		} 
	}
	
	function reset_search(){
		search.value = "";
		search_for("");
		search.input = false;
		
		search.style.opacity = op_down; 
		search_ico.style.opacity = op_down;
		search_ico.src = "layout/bt_search.png";
		
		search.value = "SEARCH";
	}
	
	search.oninput = function(){
		if( this.value != "" ) {
			search.input = true;
			search_ico.src = "layout/bt_close1.png";
		}else{
			search.input = false;
			search_ico.src = "layout/bt_search.png"; 
		}

		if( list_visible == 1 ) json_target = json.techs;
		else json_target = json.startups;	
		
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
	
	search_ico.onclick = function(){
		if(search.input){
			reset_search();	
		}else{
			search.focus();	
		} 
	}
	
	bt_read_more.onclick = function(){
		window.open(this.url);
	}
	 
	// list bts
	//type
	list_type_bt1.onclick = function (){
		select_bt(this, true);	
		select_bt(list_type_bt2, false);
		
		reset_search();
		list_visible = 1;
		
		$(list2).hide(); 
		$(list1).show();
	}
	
	list_type_bt2.onclick = function (){
		select_bt(this, true);	
		select_bt(list_type_bt1, false);
		
		reset_search();
		list_visible = 2;
		
		$(list1).hide();
		$(list2).show();
	}
	
	
	// card bts 
	bt_close_card.onclick = function() { close_card( true ) }; 
	bt_star.onclick = function() { toggle_star( cur_node ) }; 
	
	
	// business bts 
	business.onclick = function(){
		if( !filter_lock) { 
			if( business.visible  ){
				close_filter ();
			}else{
				open_filter ();
			}
		}
	}
	
	function open_filter (){ 
		$(filter_bts).show();
		filter_lock = true;
		business.visible = true;
		change_curtain( op_up );
		business_icon.src = "layout/bt_up_g.png";
		business_lb.innerHTML = "CHOOSE A BUSINESS MODEL";
		model_lb.innerHTML = "";
		
		business.style.zIndex = 6;
		 
		for( i in json.industries ){
			itm = json.industries[i].itm;	
			itm.style.top = itm.pos - 40 + 'px';
			$(itm).delay(i*30).animate({opacity:1, top:itm.pos + 'px'}, dur, ease );
		} 
		
		setTimeout( function (){
			filter_lock = false;
		}, dur)
		
	}
	
	function close_filter(){  
		if( cur_model >= 0 ){
			business.visible = false;
			filter_lock = true;
			change_curtain( 0 );
			$(business_icon).show();
			business_icon.src = "layout/bt_down_g.png";  
			business_lb.innerHTML = "BUSINESS MODEL : ";
			model_lb.innerHTML = json.industries[cur_model].name; 
			
			for(i in json.industries){
				itm = json.industries[i].itm;	
				$(itm).animate( { opacity:0 }, dur3, ease );
			}

			setTimeout( function (){			
				$(filter_bts).hide();
				filter_lock = false;
				business.style.zIndex = "";
			}, dur3)
		}
	} 
	
	function set_model( ID, lock_card ){
		
		console.log("---------------------------------------------");
		console.log("MODEL " + ID + " : " + json.industries[ID].name);
		
		if( ID == cur_model ){
			
			close_filter (); 
			
		} else {

			cur_model = ID; 
			if( !lock_card ) close_card( true );
			clear_connections();
			filter_lock = true;
			
			set_model_list();
			
			// populate radar 
			startups_map();
			
			// close_curtain 
			setTimeout( close_filter, dur2 ); 
		
		} 
	}
	
	function set_model_list(){ 
		business_lb.innerHTML = "BUSINESS MODEL : ";
		model_lb.innerHTML = json.industries[cur_model].name; 
		
		for( i in json.industries ){
			itm = json.industries[i].itm;
			if( itm.ID == cur_model ){
				select_bt( itm, true ); 
			} else { 
				select_bt( itm, false );
			}  
		}
	} 
	
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
			
			if ( d.industries[cur_model] == 1 && 
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
		
		list_h = win_h - list_div_h*list_div_n + 5; 
		
		list1.style.height = list_h + 'px';
		list2.style.height = list_h + 'px';
		
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
									 	connect( _node, __node, .3, colors_med[ client_id ] );
										startup_on(__node, colors_med[ client_id ], white, white ); 
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
		if( cur_node == null ) new_loc = location + "?model=" + cur_model + "&slider=" + slider_x ;
		else new_loc = location + "?model=" + cur_model + "&" + list_lbs[cur_list][1] + "=" + cur_node.id + "&slider=" + slider_x;
		history.pushState({page: new_loc}, '', new_loc );
	}
	
	
	function call_card( list_id, ID, push ){ 
		
		if ( cur_list == list_id && cur_node.id == ID ) {
		
			close_card( push );
			
		} else {
			
			cur_list = list_id;  
			
			if( cur_list == 1 ){
				$(card_ico2).hide();
				$(card_ico1).show();
				$(bt_star).hide();
				card_ico_lb.innerHTML = 'TECHNOLOGY';
				card_img.className = 'tech_img';
				
			}else{ 
				$(card_ico1).hide(); 
				$(card_ico2).show();
				$(bt_star).show();
				card_ico_lb.innerHTML = 'STARTUP';
				card_img.className = 'startup_logo';
			}
			
			json_target = json[ list_lbs[list_id][0] ];

			for( i in json_target ){

				node = json_target[i]; 

				if( node.id != ID ){ 
					 
					if( list_id == 1 ) tech_off(node);
					if( list_id == 2 ) startup_off(node);  
					
				}else{  
					
					cur_node = node; 

					if(cur_node.starred){
						card_star.attr('fill-opacity', 1 )
					}else{
						card_star.attr('fill-opacity', op_down ) 
					}
					
					if( list_id == 1 ) {
						tech_on( node, white, white, 1 );
						card_name.className = "";
					} 
					
					if( list_id == 2 ) {
						startup_on(node, white, drk_gray, drk_gray);
						card_name.className = "card_name_startup";
					}	  
 
					card_img.style.backgroundImage = 'url(' + node.img + ')';
					card_name.innerHTML = node.name;
					  
					if( list_id == 1 ){  
						
						// startup connections  
						for( a in json.startups ){ 
							_node = json.startups[a]; 
							if( _node.connected.indexOf( node.id ) >= 0 ) { 
								startup_on(_node, colors_med[client_id], white, white ); 
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
								
								tech_on(_node, colors_med[client_id], colors_med[client_id], 1 ); 
							
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
												
						// startup card 
											
						card_description.innerHTML = node.description;
						
						var card_text = "";
						
						for ( a=0; a<startup_card_sub.length; a++ ){
							if( node[ startup_card_sub[a][1] ] != "" ){
								
								card_text += "<br><br><span class='card_title'>" + startup_card_sub[a][0].toUpperCase()+ "</span><br>";
								
								if( startup_card_sub[a][1] == 'funding') card_text += dollars(node[startup_card_sub[a][1]]);
								else card_text += node[startup_card_sub[a][1]];
							}  
						}  
						
						card_description.innerHTML += card_text;
						
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
	 
	
	function startup_off(node){ 
		node.container.attr( 'stroke', colors_drk[client_id] ); 
		node.container.attr('fill', colors_med[ client_id ]); 
		node.star.attr('fill', colors_med[ client_id ]); 
	}

	function startup_on(node, color_bar, color_lb, color_star){
		node.container.attr( 'stroke', color_bar );  
		node.container.attr('fill', color_lb );
		node.star.attr('fill', color_star);
	}
	
	function tech_off(node){
		node.circle.attr( 'fill', colors_drk[client_id] );
		node.circle.attr( 'fill-opacity', op_up );
		node.label.attr( 'fill', colors_drk[client_id] );
	}

	function tech_on(node, color_circ, color_lb, op_circle ){
		node.circle.attr( 'fill', color_circ );  
		node.circle.attr( 'fill-opacity', op_circle );
		node.label.attr( 'fill', color_lb ); 
	} 
	
	function reset_techs(){
		for ( i in json.techs ){ 
			node = json.techs[i];
			if (node.visible) tech_on(node, colors_med[client_id], colors_med[client_id], op_up );
		}	
	}
	
	function reset_startups(){
		for( i in json.startups ){ 
			node = json.startups[i];
			if (node.visible) startup_on(node, colors_brg[client_id], white, drk_gray);
		}	
	}
	
	function close_card( push ){  
		cur_list = null;
		cur_node = null; 
		if( push ) set_location();
		$(cards).animate( { right: -830 }, dur, ease, function(){ 
			reset_techs(); 
			reset_startups();			
			clear_connections(); 
		});  
		
		if( bt_card_settings.open ){
			close_card_settings ( false )
		}
	}
	
	bt_card_settings.onclick = open_card_settings;
	
	function open_card_settings(){ 
		bt_card_settings.open = true;
		bt_card_settings.onclick = close_card_settings;
		$(cards).animate( { right: 0 }, dur, ease );
		$(startup_data).animate( { marginRight: 2 }, dur, ease );
		bt_card_settings_img.src = "layout/bt_minus.png";  
	} 
	
	function close_card_settings ( anim ){
		bt_card_settings.open = false;
		bt_card_settings.onclick = open_card_settings;
		if( anim ) $(cards).animate( { right: -505 }, dur, ease );
		$(startup_data).animate( { marginRight: 15 }, dur, ease );
		bt_card_settings_img.src = "layout/bt_plus.png";
	}  
	
	function toggle_star( node ){
		if( node.starred ){
			
			node.starred = false;
			node.star.attr('fill-opacity', op_down ); 
			if( node == cur_node ) card_star.attr('fill-opacity', op_down )
			
			if(only_starred) startups_map();
			
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
		
		var delay;
		
		get_model = $_GET()["model"];
		if( !get_model ){
			open_filter();
		}else{
			if ( get_model != cur_model ){
				set_model( get_model, true );	
				delay = dur2;
			}else{
				delay = 0;				
				business.style.zIndex = "";	
			} 
			
			setTimeout ( function (){
				get_tech = $_GET()["tech"];
				get_startup = $_GET()["startup"]; 

				if( get_tech ) call_card( 1, get_tech, push ); 
				if( get_startup ) call_card( 2, get_startup, push );
				if( !get_startup && !get_tech ) close_card( push );
				
			}, delay);	
		}
	}
	   
	window.onpopstate = function () { check_get(false) }; 
	
	// radar scale  
		
	function calc_radius(area){
		return Math.sqrt ( area/Math.PI ) * tech_radius_factor; 
	} 
	
	map_techs.append( 'circle' )
		.attr('cx', 0)
		.attr('cy', 0)	
		//.attr('r',  log_base( 1000000, 100 ) * readiness_mod )
		.attr('r', tech_min_dist + techs_max_dist )
		.attr('stroke', colors_drk[client_id] )
		.attr('stroke-width', .1)
		.attr('stroke-opacity',.5)
		.attr('fill', colors_drk[client_id])
		.attr('fill-opacity', .3) 
	 
	
	/////////////////////// load data  
	
	d3.json("data_base.json", function(error, data)  { 
				
		json = data; 
		
		// default list order: name  
		
		sort_on( json.techs, 'name' );  
		sort_on( json.startups, 'name' );  
		
		// BUSINESS MODEL LIST  
		
		filters_h = filter_h * json.industries.length;
		
		json.industries.forEach(function(d,i) {  
			
			itm = document.createElement("div");
			itm.ID = d.id;
			itm.className = 'filter_bt';
			itm.onclick = function (){ 
				if( !filter_lock ){
					set_model( this.ID, false );  
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
		
		
		// STARTUPS LIST 
		n_startups = json.startups.length;  

		json.startups.forEach(function(d,i) {  

			itm = document.createElement("div");
			itm.ID = d.id;
			itm.className = "itm";
			itm.url = d.url;
			$(itm).hide(); 

			itm_img = document.createElement("div");
			itm_img.className = "itm_logo"; 
			itm_img.style.backgroundImage = "url(" + d.img + ")"; 
			itm.appendChild(itm_img); 

			itm_lb = document.createElement("div");
			itm_lb.className = "itm_lb";
			itm_lb.innerHTML = d.name;
			itm.appendChild(itm_lb); 
			
			itm.onclick = function(){ 
				call_card( 2, this.ID, true );
			}

			d.itm = itm; 
			list2.appendChild( itm );

		});

		// STARTUPS RADAR 
		
		total_startups = json.startups.length;
		
		starred = get_cookie("starred").split(','); 
		
		json.startups.forEach( function( d,i ) {   
			
			startup_dist = startups_ring;

			startup_container = map_startups.append('g')
				.attr('id', 'cont_startup' + d.id )
				.attr('x', 0)
				.attr('y', 0)	
				.attr('stroke', colors_brg[client_id] )
				.attr('stroke-opacity', 0)
				.attr('fill-opacity', 0)
				.attr('fill','#fff') 
				.attr('style', 'display:none');

			startup = startup_container.append('g')
				.attr('x', 0)
				.attr('y', 0)
				.attr('class', 'startup')
				.attr('transform','translate(' + startup_dist + ' 0 )'); 
				
			startup_bar = startup.append( 'line' ) 
				.attr('id', 'startup_bar' + d.id )
				.attr('stroke-width', startup_bar_radius*2 )
				.attr('stroke-linecap','round')
				.attr('x1', 0)
				.attr('x2', 0)
				.attr('y1', 0)
				.attr('y2', 0)
				.on('click', function (){
						call_card( 2, d.id, true );
					})
			 
			startup_sep = startup.append('polygon') 
				.attr('fill', colors[client_id] )
				.attr('stroke', 'none' )
				.attr('points', '1.5,1.5 0,0 -1.5,1.5')	
				.attr('transform', 'translate(' + calc_bar_sep( d.evolution ) + ' ' + (startup_bar_radius - 1.3 ) + ')');
			
			star = startup.append('g') 
				.attr('fill', drk_gray ) 
				.attr('fill-opacity', op_down )
				.attr('stroke', 'none' )			
				.on('click', function (){
						toggle_star( d )
					})
				
			star.append( 'polygon' )
					.attr('points', '0,-2.8 0.9,-0.9 3,-0.6 1.5,0.8 1.9,2.8 0,1.8 -1.9,2.8 -1.5,0.8 -3,-0.6 -0.9,-0.9')
				 
			star.append('circle') 
				.attr('cx', 0 )
				.attr('cy', 0 )
				.attr('r', startup_bar_radius/1.2 )
				.attr('fill-opacity', 0) 

			startup_lb = startup.append('text')
				.attr('id', 'startup_lb' + d.id )
				.text(d.name)
				.attr('class','startup_lb')	
				.attr('stroke-width', 0)
				.attr("dominant-baseline", "central") 
				.on('click', function (){
					call_card( 2, d.id, true );
				})

			
			if( d.connected.length > 0 ){
				
				// 0 to 1 innovation = (d.innovation[max:5] + med(techs.innovation) [max:20]) / 25	 
				var tech_innovation = 0;

				for(a=0; a<d.connected.length; a++){
					json.techs.forEach(function(t,b) {   
						if(d.connected[a] == t.id){ 
							tech_innovation += t.innovation;
						}
					});
				}
			
				tech_innovation = tech_innovation / d.connected.length;   
				d.innovation = (d.innovation + tech_innovation)/25;   
			
			} else { 
			
				// 0 to 1 innovation = d.innovation[max:5] / 5	 
				d.innovation = d.innovation / 5;   
			
			}
			
			// store objects
			d.container = startup_container;
			d.startup = startup;
			d.label = startup_lb;
			d.sep = startup_sep;
			d.bar = startup_bar;
			d.val = calc_val( d.innovation, d.evolution );
			d.star = star;
			d.starred = false;
			d.angle = startup_angle;
			d.dist = startup_dist;
			d.radius = startup_bar_radius;
			d.visible = false; 
			
			if( starred.indexOf(d.id.toString()) >= 0 ){
				d.starred = true;
				star.attr( 'fill-opacity', 1 )
			}
			
		});  
		 
		
		// TECHNOLOGIES LIST 
		n_techs = json.techs.length;
		
		var itm_mask;
		
		json.techs.forEach(function(d,i) { 
			
			itm = document.createElement("div");
			itm.id = "tech" + d.id;
			itm.ID = d.id;
			itm.className = "itm";
			itm.url = d.url;
			$(itm).hide(); 
			
			itm_mask = new Image();
			itm_mask.className = "itm_mask";
			itm_mask.src = "layout/mask_techs.png"; 
			itm.appendChild(itm_mask);
			
			itm_img = document.createElement("div");
			itm_img.className = "itm_img";
			itm_img.style.backgroundImage = "url(" + d.img + ")"; 
			itm.appendChild(itm_img);
			
			itm_lb = document.createElement("div");
			itm_lb.className = "itm_lb";
			itm_lb.innerHTML = d.name;
			itm.appendChild(itm_lb); 
			
			itm.onclick = function(){ 
				call_card(1,this.ID, true); 
			}
			
			d.itm = itm; 
			list1.appendChild( itm ); 
			
			//TECHS RADAR
			
			//store connected startups
			d.connected = [];
						
			json.startups.forEach( function( node, a) { 
				if( node.connected.indexOf( d.id ) >= 0 ){
					d.connected.push(node);
				}				
			});	  
			
			tech_radius = calc_radius( d.connected.length );
			tech_angle = i*360/n_techs - 90; 
			tech_delay = i*5;
			
			tech_container = map_techs.append('g')
				.attr('id','cont_tech' + d.id)
				.attr('x', 0)
				.attr('y', 0)
				.attr('style','display:none')
				.attr('transform','rotate(' + tech_angle + ')') 
				.on('click', function (){
						call_card( 1, d.id, true );
					})  
			
			tech = tech_container.append('g')
				.attr('x', 0)
				.attr('y', 0)
				.attr('class', 'tech') 
			
			tech_circle = tech.append('circle')
				.attr('id','tech_circle' + d.id)
				.attr('cx', 0)
				.attr('cy', 0)	
				.attr('fill', colors_med[client_id] ) 
				.attr('fill-opacity', op_up ) 
				.attr('stroke','none')
				.attr('r', tech_radius)  
			
			if( tech_angle <= 90 ){ 
				
				tech_label = tech.append('text')
					.text(d.name)
					.attr('id','tech_lb'+ d.id)			
					.attr('fill', colors_med[client_id] ) 
					.attr('class','tech_lb')	
					.attr("dominant-baseline", "central")
					.attr('stroke-width', 0)
					.attr('transform','translate(' + tech_radius * 1.5 + ' 0 )') 
			
			}else{
				
				tech_label = tech.append('text')
					.text(d.name)
					.attr('id','tech_lb'+ d.id)	
					.attr('fill', colors_med[client_id]) 
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
			d.visible = false;
 
		});  
		
		
		// default order
		sort_on( json.startups, "val" );
		
		get_model = $_GET()["model"];
		if( get_model ){ 
			cur_model = get_model; 
			$(curtain).hide();
			set_model_list(get_model);
			startups_map();
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
	
	document.body.style.background = colors[client_id];
	
	curtain.style.background = colors[client_id];  
	
	$(filter_bts).hide();
	filter_bts.style.height = filters_h + 'px';
	
	$(list1).hide();
	
	bt_search.style.left = (list_w + 30) + "px";
	
	slider_circle.style.background = colors_brg[client_id];
	slider_sep_path.setAttribute("fill", colors[client_id]);
	
	select_bt(list_type_bt2, true); 
	select_bt(list_type_bt1, false);   
	
	settings_bt3.style.color = colors_med[client_id];
	settings_bt3.style.background = colors_drk[client_id];
	
	$(settings_user).hide();
	$(bt_card_settings).hide();
	
	logo_client.src = "layout/logo_" + clients[client_id][0] + ".png";
	
	$(alert_msg).fadeOut(0);
	
	// user data visibility
	
	if(client_id == 1){
		$(user).hide();
		$(settings_guest).hide();
		$(settings_guest_title).hide();
		settings.style.height = '180px';
	}
	
	
	
}