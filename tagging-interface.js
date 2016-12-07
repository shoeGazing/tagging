
// Video Tagging Interface using HTML5's Media API
// 
// Xueqin Zhang(c) 2016
//
// This was written as prototype

// Wait for the DOM to be loaded before initialising the player
document.addEventListener("DOMContentLoaded", function() { initialiseMediaPlayer(); }, false);

// Variables to store handles to various required elements
var player;
var playPauseBtn;
var fullscreeBtn;
var fullscreen=false;
var timestamp;
var defaultBar;
var playerBar;
var mainViewer;
var canvasPlayer;
var canvasPointer;
var ctx;//pointer ctx
var WIDTH;
var HEIGHT;
//var offsetx;

if(document.fullscreenEnabled) 
    fullscreen = {
        request: "requestFullscreen",
        element: "fullscreenElement",
        exit: "exitFullscreen",
        event: "fullscreenchange"
    };
else if(document.msfullscreenEnabled) 
    fullscreen = {
        request: "msRequestFullscreen",
        element: "msFullscreenElement",
        exit: "msExitFullscreen",
        event: "msfullscreenchange"
    };
else if(document.mozfullscreenEnabled) 
    fullscreen = {
        request: "mozRequestFullScreen",
        element: "mozFullScreenElement",
        exit: "mozCancelFullScreen",
        event: "mozfullscreenchange"
    };
else if(document.webkitFullscreenEnabled) 
    fullscreen = {
        request: "webkitRequestFullscreen",
        element: "webkitFullscreenElement",
        exit: "webkitExitFullscreen",
        event: "webkitfullscreenchange"
    };

function initialiseMediaPlayer() {
	// Get a handle to the player
	player = document.getElementById('lecture-video');
	
    // Hide the browser's default controls
    player.controls = false;
    player.autoplay =true;
	// Get handles to each of the buttons and required elements
	playPauseBtn = document.getElementById('play-pause-button');
	fullscreeBtn = document.getElementById('fullscreen-button');
    timestamp = document.getElementById("timestamp"); 
    defaultBar = document.getElementById("myProgress"); 
    playerBar = document.getElementById("playerBar");
    mainViewer = document.getElementById("mainViewer");
    canvasPlayer = document.getElementById("canvasPlayer");
    canvasPointer = document.getElementById("canvasPointer");
    canvasPointer.setAttribute('width', '10');
    canvasPointer.setAttribute('height', '10');
    HEIGHT = canvasPointer.height;
    WIDTH = canvasPointer.width;
    ctx=canvasPointer.getContext("2d"); //need to solve pointer going to start issue??
    /*canvasPointer.onmousedown = myDown;
    canvasPointer.onmouseup = myUp;*/

	
	// Add a listener for the play and pause events so the buttons state can be updated
	player.addEventListener('play', function() {
		changeButtonType(playPauseBtn, 'pause');
	}, false);
	player.addEventListener('pause', function() {
		changeButtonType(playPauseBtn, 'play');
	}, false);
    player.addEventListener("timeupdate", updateProgressBar, false);
    defaultBar.addEventListener('click', clickedbar, false);
    canvasPlayer.addEventListener('click',togglePlayPause,false);
    mainViewer.addEventListener('mouseenter',function(){
        ctx.clearRect(0,0,WIDTH,HEIGHT); //not good
        playerBar.style.display = "block";
    },false);
    mainViewer.addEventListener('mouseleave',function(){
        playerBar.style.display = "none";
    },false);
}

function togglePlayPause() {
	// If the mediaPlayer is currently paused or has ended
	if (player.paused || player.ended) {
		// Change the button to be a pause button
		changeButtonType(playPauseBtn, 'pause');
		// Play the media
		player.play();
	}
	// Otherwise it must currently be playing
	else {
		// Change the button to be a play button
		changeButtonType(playPauseBtn, 'play');
		// Pause the media
		player.pause();
	}
}

function toggleFullscreen() {
	// start by checking if fullscreen was set. If not, don't continue.
    if(!fullscreen){
        return;
    }
    // Then check if an element is set and if the exit function exists 
    else if (document[fullscreen["element"]] && document[fullscreen["exit"]]) {
        document.document[fullscreen["exit"]]();
        changeButtonType(fullscreeBtn, 'fullscreen');
    } 
    // otherwise check if request exists and trigger that.
    else {
        if (player[fullscreen["request"]]) {
            player[fullscreen["request"]]();
            changeButtonType(fullscreeBtn, 'unfullscreen'); 
        }  
    }
	
}

if(fullscreen){
    document.addEventListener(fullscreen["event"], function(event){
        if(document[fullscreen["element"]]){
            changeButtonType(fullscreeBtn, 'unfullscreen'); 
        } else {
            changeButtonType(fullscreeBtn, 'fullscreen');
        }
    }, false);
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonType(btn, value) {
	btn.title = value;
	btn.className = value;
}

function timeInSecondsToTimeString(time){
    var newMinutes = Math.floor(time / 60).toString();
    newMinutes = newMinutes.length == 1 ? "0" + newMinutes : newMinutes;
    var newSeconds = Math.floor(time % 60).toString();
    newSeconds = newSeconds.length == 1 ? "0" + newSeconds : newSeconds;
    return newMinutes + ":" + newSeconds;
}

function updateProgressBar(){
    var percentage = player.currentTime/player.duration*100;
    var elem = document.getElementById("myBar"); 
    elem.style.width = percentage+'%';
    canvasPointer.style.left=(player.currentTime/player.duration*defaultBar.offsetWidth-WIDTH/2)+'px';
    drawshape(ctx);
    timestamp.innerHTML = timeInSecondsToTimeString(player.currentTime)+'/'+timeInSecondsToTimeString(player.duration);
}

function clickedbar(e){
    var mouseX=e.pageX-defaultBar.offsetLeft-playerBar.offsetLeft-mainViewer.offsetLeft;
    var newtime=mouseX*player.duration/defaultBar.offsetWidth;
    player.currentTime = newtime;
}

function drawshape(context){
    context.beginPath();
    context.arc(WIDTH/2,HEIGHT/2,HEIGHT/2,0,2*Math.PI);
    context.fillStyle = 'red';
    context.fill();
}

/*function myDown(e){
   offsetx =e.pageX - canvasPointer. offsetLeft-defaultBar.offsetLeft-playerBar.offsetLeft-mainViewer.offsetLeft;
   document.onmousemove = getMouse;
   console.log(offsetx);
}

function myUp(){

}

function getMouse(e) {
     canvasPointer.style.left=e.pageX-offsetx-defaultBar.offsetLeft-playerBar.offsetLeft-mainViewer.offsetLeft;
     console.log('test');
}*/

// Constructor for Shape objects to hold data for all drawn objects.
function Ball(cx, cy, r, startA, endA, fill) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  this.cx = cx || 0;
  this.cy = cy || 0;
  this.r = r || 1;
  this.startA = startA || 0;
  this.endA = endA || 2*Math.PI;
  this.fill = fill || '#AAAAAA';
}

// Draws this shape to a given context
Ball.prototype.draw =function(ctx){
    ctx.beginPath();
    ctx.arc(this.cx,this.cy,this.r,this.startA,this.endA);
    ctx.fillStyle = this.fill;
    ctx.fill();
}

// Determine if a point is inside the shape's bounds
Ball.prototype.contains = function(mx,my){
    // All we have to do is make sure the Mouse X,Y fall in the area

}

function CanvasBallState(canvas){
    // **** First some setup! ****
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // This complicates things a little but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
     if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;
    // **** Keep track of state! ****
    this.valid = false; // when set to false, the canvas will redraw everything
    this.balls = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    // **** Then events! ****

    // This is an example of a closure!
    // Right here "this" means the CanvasBallState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasBallState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;
    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e){e.preventDefault(); return false;}, false);
    // up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e){
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var balls = myState.balls;
        var l = balls.length;
        for (var i=l-1;i>=0;i--){
            
        }
    })   
}

