var characters = null;
var legendgs = null;
var characterSize = 26;



function startGame(gs) {


	var textBoxes = null;
	var speechBox = document.getElementById('text');
	var speakerBox = document.getElementById('speaker');

	characterSize = 26;
	var objectSize = 7;

	characters = null;
	var pawns = null;
	var allObjects = null;


	var socket = null;

	/**
	 * This method consumes the event of receiving new data from the server
	 * @param {string} e the event arguments (message content) of the message
	 */
	function onMessage(e) {
		// need to parse the message to update all people's values
		var parsedMsg = e.split('\t');
		switch (parsedMsg[0]) {
			case "BOX":
				//console.log("")
				textBoxes.updateText(parsedMsg[1], parsedMsg[2]);
//				textBoxes.who = parsedMsg[1];
//				textBoxes.text = parsedMsg[2];
				break;
			case "CHAR":
				var curChar = findItem('C', parsedMsg[1]);
				curChar.x = parseFloat(parsedMsg[2]);
				curChar.y = parseFloat(parsedMsg[3]);
				curChar.angle = parseFloat(parsedMsg[4]);
				// need to figure out if point or object
				var ptObj = parsedMsg[5];
				if(ptObj == "null") {
					curChar.pointTo = null;
				} else {
					curChar.pointTo = ptObj;
				}
				curChar.pointAngle = parseFloat(parsedMsg[6]);
				break;
			case "PAWN":
				var curPawn = findItem('O', parsedMsg[1]);
				curPawn.x = parseFloat(parsedMsg[2]);
				curPawn.y = parseFloat(parsedMsg[3]);
				curPawn.showcolor = parsedMsg[4];
				break;
			case "CONFIRMED":
				// do nothing
				break;
			default:
				console.log("ERROR - invalid message:" + e);
				break;
		}

	}

	function findItem(type, name) {
		if(type == 'C') {
			// loop through all chars
			for(var i = 0; i < characters.length; i++) {
				if(characters[i].name == name) {
					return characters[i];
				}
			}
		} else {
			// loop through all objects
			for(var j = 0; j < pawns.length; j++) {
				if(pawns[j].name == name) {
					return pawns[j];
				}
			}
		}
		// error!!
		console.log("couldn't find " + type + " with name=" + name);
		return null;
	}

	/**
	 * This method restart the intro screen on disconnect
	 * @param {object} e event arguments
	 */
	function onDisconnect(e) {
		myconnect();
	}

	/**
	 * This method creates ui event handlers and requests the flow of server data
	 * @param {object} e event arguments
	 */
	function onConnect(e) {

		socket.send('CONFIRMED');

	}

	/**
	 * This initializes the variables so can restart the game when completed
	 */
	function myconnect() {
		socket = io.connect('http://localhost:8081');
		socket.on('message', onMessage);
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		console.log("in myconnect, after connecting");
	}

	/**
	 * This method closes the socket connection
	 */
	function myclose() {
		if(socket !== undefined) {
			socket.disconnect();
		}
	}

	function Character(name, x, y, angle, color, neg) {
		this.name = name;
		this.talking = false;
		this.x = -1*(x - 2312)/2; // cleanup point values
		this.y = (y-209)/2; // cleanup point values
		this.angle = angle;
		this.r = characterSize;
		this.fs = 'rgba(' + color + ', 1.0)';
		this.item = null;
		this.pointTo = null;
		this.pointAngle = 0;
		this.gazeTo = null;
		this.moveTo = null;
		if(characters == null) {
			characters = new Array();
			characters[0] = this;
		} else {
			characters[characters.length] = this;
		}
		if(allObjects == null) {
			allObjects = new Array();
			allObjects[0] = this;
		} else {
			allObjects[allObjects.length] = this;
		}
		//drawlegend(legendgs);

		this.draw = function(c, gs) {
			c.fillStyle = this.fs;
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			c.closePath();
			c.fill();
			c.lineWidth = 4;
			c.strokeStyle = 'rgba(' + neg + ', 1.0)';
			c.moveTo(this.x, this.y);
			c.lineTo(this.x + (this.r * Math.sin(this.angle)), this.y + (this.r * Math.cos(this.angle)));
			c.stroke();
			c.fillStyle = '#000';
			//c.font = 'bold 10px sans-serif';
			//c.textBaseline = 'bottom';
			//c.fillText(this.name, this.x - (3.5 * this.name.length), this.y - characterSize);

			if(this.pointTo != null) {

				c.moveTo(this.x + (this.r * Math.sin(this.pointAngle)), this.y + (this.r * Math.cos(this.pointAngle)));
				c.lineTo(this.x + (this.r * Math.sin(this.pointAngle)) + (15 * Math.sin(this.pointAngle)), this.y + (this.r * Math.cos(this.pointAngle)) + (15 * Math.cos(this.pointAngle)));
				c.stroke();
			}
			if(this.talking) {
				this.drawBubble(c);
			}
		}
		
		this.drawBubble = function(ctx)
		{
			var x = this.x;
			var y = this.y-characterSize-70;
			var w = 250;//6.5*(speechBox.innerHTML.length) +50;//200 * (speechBox.innerHTML.length/25);
			var h = 60;
			var radius = 20;
		  var r = x + w;
		  var b = y + h;
		  ctx.beginPath();
		  ctx.strokeStyle="black";
		  ctx.lineWidth="2";
		  ctx.moveTo(x+radius, y);
		  
		  ctx.lineTo(r-radius, y);
		  ctx.quadraticCurveTo(r, y, r, y+radius);
		  ctx.lineTo(r, y+h-radius);
		  ctx.quadraticCurveTo(r, b, r-radius, b);
		  ctx.lineTo(x+radius, b); // change where go to, want it to be 
		  ctx.lineTo(x+radius*2, b);
		  ctx.lineTo(x+radius/2, b+10);
		  ctx.lineTo(x+radius, b);
		  
		  ctx.quadraticCurveTo(x, b, x, b-radius);
		  ctx.lineTo(x, y+radius);
		  ctx.quadraticCurveTo(x, y, x+radius, y);
		  ctx.stroke();
		  ctx.fillStyle = '#fff';
		  ctx.fill();
		  ctx.fillStyle = '#000';
		  ctx.font = '14px monospace';
		  ctx.fillText(textBoxes.text, x+20, y+35);
		}
	}// end of Character object

	function SpeechBox() {
		this.who = null;
		this.text = null;
		textBoxes = this;

		this.updateText = function(who, text) {
			this.who = who;
			this.text = text;
			//speechBox.innerHTML = this.text;
			//speakerBox.innerHTML = this.who;
			if (text == "") {
				for (var i=0; i < characters.length; i++) {
					characters[i].talking = false;
				}
//				findItem('C', who).talking = true;
			} else
				findItem('C', who).talking = true;
		}
		
		
	}// end of SpeechBox object

	function Pawn(name, x, y, color, neg, letter) {
		this.name = name;
		this.x = -1*(x - 2312)/2; // cleanup point values
		this.y = (y-209)/2; // cleanup point values
		this.r = objectSize;
		this.color = color;
		this.neg = neg;
		this.letter = letter;
		this.showcolor = this.neg;
		this.ownedby = null;
		if(pawns == null) {
			pawns = new Array();
			pawns[0] = this;
		} else {
			pawns[pawns.length] = this;
		}
		if(allObjects == null) {
			allObjects = new Array();
			allObjects[0] = this;
		} else {
			allObjects[allObjects.length] = this;
		}

		this.draw = function(c, gs) {
			c.fillStyle = 'rgba(' + this.showcolor + ', 1.0)';
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
			c.closePath();
			c.fill();
			c.stroke();
			if (this.showcolor == this.neg) {
				c.fillStyle = '#000';
			} else {
				c.fillStyle = '#FFF';
			}
			c.font = 'bold 14px sans-serif';
			c.textBaseline = 'middle';
			c.textAlign = 'center';
			c.fillText(this.letter, this.x, this.y);
		}
	}// end of Object object
	


	//********************************************
	//* Start of main code
	//********************************************

	gs.addEntity(new SpeechBox());
	// create pawns
	
// ************************************************************************************************
// Create physical pawns and characters - top right corner is 200,200, bottom left corner is 2300,1650
// ************************************************************************************************
	var shovel = gs.addEntity(new Pawn('SHOVEL', 935 - 50, 100, '0, 0, 0', '234, 234, 234', 'S'));
	var skull1 = gs.addEntity(new Pawn('SKULL1', 1571 - 5, 914, '0, 0, 0', '234, 234, 234', 'X'));
	var skull2 = gs.addEntity(new Pawn('SKULL2', 1571 + 5, 914, '0, 0, 0', '234, 234, 234', 'X'));
	var lantern = gs.addEntity(new Pawn('LANTERN', 1041, 100, '0, 0, 0', '234, 234, 234', 'L'));
	
	// create characters
		
	var gravedigger2 = gs.addEntity(new Character('GRAVEDIGGER2', 935, 100, 0, '171,130,255', '85,26,139'));
	var horatio = gs.addEntity(new Character('HORATIO', 1253, 100, 0, '233,150,122', '139,69,0'));
	var hamlet = gs.addEntity(new Character('HAMLET', 1147, 100, 0, '0,205,0', '0,100,0'));
	var gravedigger1 = gs.addEntity(new Character('GRAVEDIGGER1', 1041, 100, '100, 149, 237', '51,161,201'));// '135,206,250'));//, '0,0,128'
// ************************************************************************************************
// ************************************************************************************************
	
	console.log("Done setup, ready to connect");
	myconnect();
	console.log("After myconnect");

}

	function drawlegend(gs) {
		if (legendgs == null) {
			legendgs = gs;
		}
		/*
		function legend() {
		this.x = 0;
		this.y = 0;
		
			
	/*	this.draw = function(c, gs) {
			//console.log("Drawing");
			c.fillStyle = '#000';
			c.font = 'bold 20px sans-serif';
			c.textBaseline = 'bottom';
			c.fillText("LEGEND", 65, 100);
			c.fillText("------------", 65, 115);
			for (var i = 0; i < characters.length; i++) {
				//console.log("Drawing "+characters[i].name);
				var x = 50;
				var y = i*100+200;
				c.fillStyle = characters[i].fs;
				c.beginPath();
				c.arc(x, y, characters[i].r, 0, Math.PI * 2, true);
				c.closePath();
				c.fill();
				c.lineWidth = 4;
				c.strokeStyle = 'rgba(' + characters[i].neg + ', 1.0)';
				c.moveTo(x, y);
				c.lineTo(x + (characters[i].r * Math.sin(Math.PI/2)), y + (characters[i].r * Math.cos(Math.PI/2)));
				c.stroke();
				c.fillStyle = '#000';
				c.font = 'bold 14px sans-serif';
				c.textBaseline = 'middle';
				c.fillText(characters[i].name, x + characterSize+10, y);
			}
			
		}
	}
	
	gs.addEntity(new legend()); */
	}