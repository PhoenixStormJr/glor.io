

// Keep track of our socket connection
var socket;
let mouseDown = false;

let playerX = 0;
let playerY = 0;

let otherX = [];
let otherY = [];

let oX = [];
let oY = [];


let up = false;
let down = false;
let right = false;
let left = false;

let offx = 8;
let offy = 16;

let number = 0;

let repeat = 0;

function setup() {
  createCanvas(windowWidth - offx, windowHeight - offy);
  background(0);
  
  // Start a socket connection to the server
  // Some day we would run this server somewhere else

  socket = io.connect('http://localhost:8080');

  // We make a named event called 'mouse' and write an
  // anonymous callback function

  socket.on('position',

    // When we receive data

    function(data) {

      // Draw a blue circle

      fill(0,0,255);
      noStroke();
      otherX[data.z] = data.x;
      otherY[data.z] = data.y;
    }
  );

  




  var numberPlease = {
    n: 0
  };
  socket.emit('whatsMyNumber?',numberPlease);

  
  

  socket.on('yourNumberIs',

  // When we receive data
  
  function(numberPlease) {
    if(number < 1){
    printl("my number is: " + numberPlease.n);
    number = numberPlease.n;
  }}


  );





}// setup

function draw() {
  





if(number > 0){
  background(255);
  fill(255,255,0);
  rect(playerX,playerY,100,100);
  fill(255,0,0);



  repeat = 1;
  while(repeat < 50){ // # of players
    rect(otherX[repeat],otherY[repeat],100,100);
    repeat = repeat + 1;
  }


  if(right){
    playerX = playerX + 1;
    sendPosition(playerX,playerY,number);
  }
  if(left){
    playerX = playerX - 1;
    sendPosition(playerX,playerY,number);
  }
  if(up){
    playerY = playerY - 1;
    sendPosition(playerX,playerY,number);
  }
  if(down){
    playerY = playerY + 1;
    sendPosition(playerX,playerY,number);
  }
















document.addEventListener('keyup', (event) => { 
if (event.key == 'ArrowUp' || event.key == 'w') {
  up = false;
}
if (event.key == 'ArrowDown' || event.key == 's') {
  down = false;
}
if (event.key == 'ArrowRight' || event.key == 'd') {
  right = false;
}
if (event.key == 'ArrowLeft' || event.key == 'a') {
  left = false;
}
}); 
  

document.addEventListener('keydown', (event) => {
  if (event.key == 'ArrowUp' || event.key == 'w') {
    up = true;
  }
  if (event.key == 'ArrowDown' || event.key == 's') {
    down = true;
  }
  if (event.key == 'ArrowRight' || event.key == 'd') {
    right = true;
  }
  if (event.key == 'ArrowLeft' || event.key == 'a') {
    left = true;
  }
});



}



}





function mouseDragged() {
  // Draw some white circles

  fill(255);
  noStroke();
  ellipse(mouseX,mouseY,80,80);

  // Send the mouse coordinates
  //sendmouse(mouseX,mouseY);
}


// Function for sending to the socket

function sendPosition(xpos, ypos) {

  // We are sending!

  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos,
    z: number
  };

  // Send that object to the socket
  socket.emit('position',data);
  

}










function mousePressed(){
  mouseDown = true;
}
function mouseReleased(){
  mouseDown = false;
}











function printl(consoleStuff){


var println1 = {
    printdata: consoleStuff
};

  // Send that object to the socket
  socket.emit('println2',println1);



}