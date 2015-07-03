window.onload = function(){
			
	var logo = document.getElementById('logo');
	var msg = document.getElementById('msg');
	var form = document.getElementById('form');
	var submit = document.getElementById('submit');
	var password = document.getElementById('password');
	var login = document.getElementById('login'); 

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
		$(document.body).css({background:theme.bg});
		$(submit).css({background:theme.drk});
		$(msg).css({color:theme.alert});
		$(logo).css({backgroundImage:"url(_clients/" + client + "/logo.png)" });
		$(document.body).fadeIn(250); 
	}); 
	
	var destination; 
	
	if(get_msg) msg.innerHTML = get_msg.split('-')[0] + " " + get_msg.split('-')[1];

	function go(){ 
		window.sessionStorage.setItem('login', login.value);
		window.sessionStorage.setItem('password', password.value);  
		destination = "radar.html?client=" + client;
		if( get_categ ) destination += "&categ=" + get_categ; 
		if( get_tech ) destination += "&tech=" + get_tech;
		if( get_slider ) destination += "&slider=" + get_slider; 
		document.location.href = destination;
	}

	window.onkeydown = function(e){
		if(e.keyCode == 13 ){
			go();
		}
	}

	submit.onclick = go;  
	
}