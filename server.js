/**
 * @fileoverview This file provides server socket listener for the game
 * @author Christine Talbot & Todd Dobbs
 */
var io = require('socket.io').listen(8081);

io.set('log level', 0);
var main = require('./main');

var sockets = null;

/**
 * This handles new connections to the game server
 */
io.sockets.on('connection', function(socket) {
	sockets = socket;
	console.log("connection!");
	main.startGame();
	socket.send("CONFIRMED");
	//var otherInfo = main.createUpdMsg();

	//socket.send(otherInfo); // let client know whether he can play or not

	/**
	 * This handles messages from the client(s) - mainly KEY presses and PINGs
	 */
	socket.on('message', function(data) {
		// when get data from client, process it in gameserver
		// not expecting any data so do nothing
//console.log("got message!");
	});
	/**
	 * This handles disconnects from the server by the players
	 */
	socket.on('disconnect', function() {
		// when client terminates session, remove them:
console.log("got disconnect");
		main.endSimulation();

	});
});
/**
 * This sends the new information for every entity in the game
 * @param {String} updMsg The string to be sent to all connected clients
 */
function sendMsg(updMsg) {
//console.log("sending message");
	sockets.send(updMsg);

}

/**
 * This handles closing a socket when the player hits 0 health
 */
function closeSocket() {
	console.log("closing socket");
	sockets = null;
}

// export these functions so networkServer.js can call them
exports.closeSocket = closeSocket;
exports.sendMsg = sendMsg;
