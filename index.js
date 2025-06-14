var Typer={
	text: null,
	accessCountimer:null,
	index:0, 
	speed:1,
	file:"", 
	accessCount:0,
	deniedCount:0,
	glitchInterval: null,
	init: function(){
		accessCountimer=setInterval(function(){Typer.updLstChr();},200);
		$.get(Typer.file,function(data){
			Typer.text=data;
			Typer.text = Typer.text.slice(0, Typer.text.length-1);
			Typer.startGlitchEffect();
		});
	},
 
	content:function(){
		return $("#console").html();
	},
 
	write:function(str){
		$("#console").append(str);
		return false;
	},
 
	startGlitchEffect: function() {
		this.glitchInterval = setInterval(function() {
			if(Math.random() > 0.95) {
				$("#console").css({
					'text-shadow': '0 0 5px #0f0, 0 0 10px #0f0, 0 0 15px #0f0',
					'color': '#0f0'
				});
				setTimeout(function() {
					$("#console").css({
						'text-shadow': 'none',
						'color': '#0f0'
					});
				}, 50);
			}
		}, 100);
	},
 
	addText:function(key){
		if(key.keyCode==18){
			Typer.accessCount++; 
			if(Typer.accessCount>=3){
				Typer.makeAccess(); 
			}
		}
		else if(key.keyCode==20){
			Typer.deniedCount++; 
			if(Typer.deniedCount>=3){
				Typer.makeDenied(); 
			}
		}
		else if(key.keyCode==27){ 
			Typer.hidepop(); 
		}
		else if(Typer.text){ 
			var cont=Typer.content(); 
			if(cont.substring(cont.length-1,cont.length)=="|") 
				$("#console").html($("#console").html().substring(0,cont.length-1)); 
			if(key.keyCode!=8){ 
				Typer.index+=Typer.speed;	
			}
      		else {
				if(Typer.index>0) 
					Typer.index-=Typer.speed;
			}
			var text=Typer.text.substring(0,Typer.index)
			var rtn= new RegExp("\n", "g"); 
	
			$("#console").html(text.replace(rtn,"<br/>"));
			window.scrollBy(0,50); 
		}
		
		if (key.preventDefault && key.keyCode != 122) { 
			key.preventDefault()
		};  
		
		if(key.keyCode != 122){
			key.returnValue = false;
		}
	},
 
	updLstChr:function(){ 
		var cont=this.content(); 
		if(cont.substring(cont.length-1,cont.length)=="|") 
			$("#console").html($("#console").html().substring(0,cont.length-1)); 
		else
			this.write("|"); 
	}
}
 
function replaceUrls(text) {
	var http = text.indexOf("http://");
	var space = text.indexOf(".me ", http);
	
	if (space != -1) { 
		var url = text.slice(http, space-1);
		return text.replace(url, "<a href=\""  + url + "\">" + url + "</a>");
	} 
	else {
		return text
	}
}

$("<style>")
	.prop("type", "text/css")
	.html(`
		#console {
			background-color: #000;
			color: #0f0;
			font-family: 'Courier New', monospace;
			padding: 20px;
			text-shadow: 0 0 5px #0f0;
			animation: scanline 8s linear infinite;
		}
		@keyframes scanline {
			0% { background-position: 0 0; }
			100% { background-position: 0 100%; }
		}
		#console::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				transparent 0%,
				rgba(0, 255, 0, 0.2) 50%,
				transparent 100%
			);
			background-size: 100% 4px;
			pointer-events: none;
		}
	`)
	.appendTo("head");

Typer.speed=1;
Typer.file="hellodan.txt";
Typer.init();
 
var timer = setInterval("t();", 20);
function t() {
	Typer.addText({"keyCode": 123748});
	
	if (Typer.index > Typer.text.length) {
		clearInterval(timer);
	}
}
 
