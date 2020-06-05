// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html


// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);

let players = 0;

let repeat = 0;
let player = [];

repeat = 0;
while(repeat < 50){//number of players
player[repeat] = false;
repeat = repeat + 1;
}

server.listen(8080);

console.log('Server started on port 8080');

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects

io.sockets.on('connection',

  // We are given a websocket object in our function

  function (socket) {
  
    console.log("We have a new client: " + socket.id);
    players = players + 1;
    console.log("players: " + players);
    // When this user emits, client side: socket.emit('otherevent',some data);

    socket.on('position',
      function(data) {

        // Data comes in as whatever was sent, including objects

        console.log("Received: 'position' " + data.x + " " + data.y + " from player: " + data.z);
        
        // Send it to all other clients
        
        socket.broadcast.emit('position', data);
        
        // This is a way to send to everyone including sender
        
        //io.sockets.emit('message', "this goes to everyone");

      } // data
    ); // mouse
    





    socket.on('whatsMyNumber?',
    function(numberPlease) {

      // Data comes in as whatever was sent, including objects

      console.log("Received: 'numberRequest' " + numberPlease.n);
      numberPlease.n = players;

      // Send it to all other clients
      socket.broadcast.emit('yourNumberIs', numberPlease);

      // This is a way to send to everyone including sender
      io.sockets.emit('yourNumberIs', numberPlease);


      console.log("sent: " + numberPlease.n);
    } // data
  ); // mouse


    socket.on('println2',
      function(println1) {

        console.log(println1.printdata);

      } // data
    ); // mouse
    
    

    socket.on('disconnect', function() {
      console.log("Client has disconnected: " + socket.id);
      players = players - 1;
      console.log("players: " + players);
    });
  }
);