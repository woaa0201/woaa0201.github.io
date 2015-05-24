process.title = "node-chat";

var serverPort = 2112;

var webSocketServer = require('websocket').server;
var http = require('http');

var history = [];
var clients = [];
var current_users = [];

// escape input strings
function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
}

var colors = ['red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange'];
colors.sort(function(a,b) {
  return Math.random() > 0.5;
});

// http server
var server = http.createServer(function(request, response) {});
server.listen(serverPort, function() {
  console.log((new Date()) + " Server is listening on port " + serverPort);
});

// websocket server
var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  console.log((new Date()) + " Connection from origin " + request.origin + ".");

  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;

  console.log((new Date()) + " Connection accepted.");

  // send the new user the current participants
  if (current_users.length > 0) {
    for (var i=0; i < current_users.length; i++) {
      var user = current_users[i];
      connection.sendUTF(user);
    }
  }

  console.log((new Date()) + " New user's chat list updated.");



  if (history.length > 0) {
    connection.sendUTF(JSON.stringify( { type: 'history', data: history}));
  }

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      if (userName === false) {
        userName = htmlEntities(message.utf8Data);

        // assign username a color
        userColor = colors.shift();
        connection.sendUTF(JSON.stringify( { type: 'color', data: userColor } ));
        console.log((new Date()) + " User's handle is " + userName + " with color " + userColor);

        // add the new user to everyone's chat room list
        var json = JSON.stringify( { type: 'user', uname: userName, color: userColor } );
        current_users.push(json);
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      } else {
        console.log((new Date()) + " Received Message from " + userName + ": " + message.utf8Data);
        var obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        };
        history.push(obj);
        history = history.slice(-100);

        // broadcast the message
        var json = JSON.stringify({ type: 'message', data: obj });
        for (var i = 0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
    }
  });

  connection.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");

      // notify other clients the user has left
      if (clients.length > 1) {
        var json = JSON.stringify({ type: 'remove-user', uname: userName });
        for (var i = 0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
      console.log(" before splicing: " + current_users);
      clients.splice(index, 1);
      colors.push(userColor);

      // Calculate the index in current_users
      // Necessary if another user connects between a person hitting the page and inputting a name
      var userIndex = current_users.indexOf({ type: 'user', uname: userName, color: userColor })
      current_users.splice(userIndex, 1);

      console.log("index removed: " + index);
      console.log(" close function: " + current_users);
    }
  });

});
