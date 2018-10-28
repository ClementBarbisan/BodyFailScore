	window.onload = function(){
		document.body.onmousemove = function(event){
			drag(event);
			resize(event);
		}
	
		var fenetres = document.getElementsByClassName("fenetre");
		nbFenetre = fenetres.length;
		var top = 50;
		var left = 50;
		var one;
		var menu;
		for(i=0;i<fenetres.length;i++){ // parcours de toutes les div fenetre de la page.
			one = fenetres[i];
			one.style.top = top + 15*i;
			one.style.left = left + 15*i;
			one.style.zIndex = i+1;
			
			one.onmousedown = function(event){ // mise en place des événement
				comeForward(this);
				startResize(this, event);
				};
			one.onmousemove = function(event){
				changeCursor(event, this);
				resize(event);
			};
			one.onmouseup = function(){ stopResize(); };
			
			menu = one.getElementsByClassName("menu")[0];
			menu.ondblclick = function(){ minmax(this.parentNode.parentNode); };
			menu.onmousedown = function(event){ startDrag(event, this.parentNode.parentNode); };
			menu.onmousemove = function(event){ drag(event); };
			menu.onmouseup = stopDrag;
			
			// création des boutons
			(menu.getElementsByClassName("fermer")[0]).onclick = function(){ fermer(this.parentNode.parentNode.parentNode); };
			(menu.getElementsByClassName("fermer")[0]).innerHTML = "X";
			(menu.getElementsByClassName("reduire")[0]).onclick = function(){ reduire(this.parentNode.parentNode.parentNode); };
			(menu.getElementsByClassName("reduire")[0]).innerHTML = "_";
			(menu.getElementsByClassName("minmax")[0]).onclick = function(){ minmax(this.parentNode.parentNode.parentNode); };
			(menu.getElementsByClassName("minmax")[0]).innerHTML = "[]";
			
		}
	}
	
	// variables globales pour le drag
	var dragged = false;
	var fenetre;
	var sourisX;
	var sourisY;
	var fenetreX;
	var fenetreY;
	var cole = 15;
	var nbFenetre;

	function startDrag(ev, div){
		fenetre = div;
		if(!div.classList.contains("reduit")){
			dragged = true;
			fenetre.style.MozTransitionDuration = "0s";
			fenetre.style.WebkitTransitionDuration = "0s";
			sourisX = ev.clientX;
			sourisY = ev.clientY;
			fenetreX = fenetre.offsetLeft;
			fenetreY = fenetre.offsetTop;
		}
		ev.preventDefault();
	}
	
	function drag(ev){
		if(dragged){
			moveTo(ev.clientX - sourisX + fenetreX, ev.clientY - sourisY + fenetreY);
		}
	}
	
	function moveTo(moveX, moveY){
		
		if(moveY > document.height - fenetre.clientHeight - cole - 10){
			fenetre.style.top = document.height - fenetre.clientHeight - 10 + "px";
		}
		else if(moveY < cole){
			fenetre.style.top = "0px";
		}
		else{
			fenetre.style.top = moveY + "px";
		}
		
		if(moveX > document.width - fenetre.clientWidth - cole - 10){
			fenetre.style.left = document.width - fenetre.clientWidth - 10 + "px";
		}
		else if(moveX < cole){
			fenetre.style.left = "0px";
		}
		else{
			fenetre.style.left = moveX + "px";
		}
	}
	
	function stopDrag(){
		fenetre.style.MozTransitionDuration = "0.2s";
		fenetre.style.WebkitTransitionDuration = "0.2s";
		dragged = false;
	}
	
	// variables globales pour le resize
	var resized = false;
	var direction = "";
	var fenetreHeight;
	var fenetreWidth;
	var minSizeHeight = 25;
	
	function changeCursor(ev, div){
		if(!resized){
			var curso = "";
			var bord = 5;
			
			if(ev.clientY < div.offsetTop+bord) curso += "n";
			if(ev.clientY > div.offsetTop+div.offsetHeight-bord) curso += "s";
			if(ev.clientX > div.offsetLeft+div.offsetWidth-bord) curso += "e";
			if(ev.clientX < div.offsetLeft+bord) curso += "w";
			
			direction = curso;
			
			if(curso == "") curso = "auto";
			else curso += "-resize";
			div.style.cursor = curso;
			document.body.cursor = curso;
		}
	}
	
	function startResize(div, ev){
		if(!dragged){
			fenetre = div;
			if(!div.classList.contains("reduit")){
				resized = true;
				fenetre.style.MozTransitionDuration = "0s";
				fenetre.style.WebkitTransitionDuration = "0s";
				fenetreX = fenetre.offsetLeft;
				fenetreY = fenetre.offsetTop;
				fenetreWidth = fenetre.clientWidth;
				fenetreHeight = fenetre.clientHeight;
				sourisX = ev.clientX;
				sourisY = ev.clientY;
			}
		}
		ev.preventDefault();
	}
	
	var maxResizeX;
	var maxResizeY;
	
	function resize(ev){
		if(resized){
			fenetre.classList.remove("max");
			var minSizeWidth = fenetre.getElementsByClassName("titre")[0].clientWidth + 5;
			var resizeX = ev.clientX - sourisX;
			var resizeY = ev.clientY - sourisY; // différence entre le depart et l'arrivé
			
			var modif;
			var x = fenetreX;
			var y = fenetreY;
			var haveToMove = false;
			if(direction.indexOf("n") != -1){
				modif = fenetreHeight - resizeY;
				if(modif > minSizeHeight){ // si on est supérieur à la taille mini
					fenetre.style.height = modif + "px";
					haveToMove = true;
					y += resizeY;
					maxResizeY = resizeY;
				}
				else{
					y += maxResizeY
				}
			}
			if(direction.indexOf("s") != -1){
				modif = fenetreHeight + resizeY;
				if(modif > minSizeHeight) fenetre.style.height = modif + "px";
			}
			if(direction.indexOf("w") != -1){
				modif = fenetreWidth - resizeX;
				if(modif > minSizeWidth){
					fenetre.style.width = modif + "px";
					haveToMove = true;
					x += resizeX;
					maxResizeX = resizeX;
				}
				else{
					x += maxResizeX;
				}
			}
			if(direction.indexOf("e") != -1){
				modif = fenetreWidth + resizeX;
				if(modif > minSizeWidth) fenetre.style.width = modif + "px";
			}
			
			if(haveToMove) moveTo(x, y);
		}
	}
	
	function stopResize(){
		fenetre.style.MozTransitionDuration = "0.2s";
		fenetre.style.WebkitTransitionDuration = "0.2s";
		resized = false;
	}
	
	function fermer(div){
		div.style.width = div.offsetWidth + 100;
		div.style.height = div.offsetHeight + 100;
		div.style.top = div.offsetTop - 50;
		div.style.left = div.offsetLeft - 50;
		div.classList.add("apu");
		div.classList.remove("reduit");
		div.classList.remove("max");
	}
	
	function minmax(div){
		div.classList.toggle("max");
		div.classList.remove("reduit");
	}
	
	function reduire(div){
		div.classList.toggle("reduit");
		div.classList.remove("max");
	}
	
	// met la fenetre en premier plan
	function comeForward(div){
		var index = div.style.zIndex;
		var fenetres = document.getElementsByClassName("fenetre");
		for(i=0;i<fenetres.length;i++){
			if(fenetres[i].style.zIndex > index){
				fenetres[i].style.zIndex -= 1;
			}
		}
		div.style.zIndex = nbFenetre;
	}