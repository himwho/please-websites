// Set up a 30 Hz frame rate
frameRate    =  30;
timeInterval = Math.round( 500 / frameRate );
var relMouseX    = 0;
var relMouseY    = 0;
var followerX    = 0;
var followerY    = 0;
var relMouseXNorm    = 0;
var relMouseYNorm    = 0;
var followerXNorm    = 0;
var followerYNorm    = 0;
var stage = document.querySelector("#stage");
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

stage.addEventListener("touchstart", dragStart, false);
stage.addEventListener("touchend", dragEnd, false);
stage.addEventListener("touchmove", drag, false);

$(document).ready( function () {
  // get the stage offset
  offset = $('#stage').offset();
  var startButton = document.getElementById("startButton");
  var follower = document.getElementById("follower");

  // start calling animateFollower at the 'timeInterval' we calculated above
  atimer = setInterval( "animateFollower()", timeInterval );
  atimerPanner = setInterval( "calculateAudioEffects()" , 10);
} );

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioPlayer = document.getElementById("myAudio");
var source = audioCtx.createMediaElementSource(audioPlayer);
const gainNode = audioCtx.createGain();
const panNode = audioCtx.createStereoPanner();
source.connect(gainNode).connect(panNode).connect(audioCtx.destination);

// One-liner to resume playback when user interacted with the page.
startButton.addEventListener('click', function() {
  // check if context is in suspended state (autoplay policy)
  audioCtx.resume().then(() => {
    console.log('Playback resumed successfully');
  }); 
  audioPlayer.play();
  
  follower.style.display = "block";
  startButton.style.display = "none";
});

// track and save the position of the mouse
$(document).mousemove( function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  relMouseX = mouseX - offset.left;
  relMouseY = mouseY - offset.top;

  // display the current mouse positions
  $('#mouse_x-trace').text( mouseX );
  $('#mouse_y-trace').text( mouseY );
} );

function calculateAudioEffects() {
 	follow = $('#follower').offset();
	followerX = follow.left;
	followerY = follow.top;
  	followerXNorm = followerX/$(window).width();
  	followerYNorm = followerY/$(window).height();
  	relMouseXNorm = relMouseX/$(window).width();
  	relMouseYNorm = relMouseY/$(window).height();
	//pan sound
  	let panning = followerXNorm-relMouseXNorm;
  	panNode.pan.value = panning;

	let dist = getDistance(followerX, followerY, relMouseX, relMouseY);
	let distNorm = dist/Math.max($(window).width(), $(window).height());
	let gainValue = mapRange(distNorm, 0, 1, 1, 0);
	gainNode.gain.value = easeIn(gainValue);
	
	if (relMouseX<followerX){
  		$('#follower').css('transform','scaleX(-1)');
	}else if(relMouseX>followerX){
		$('#follower').css('transform','scaleX(1)');
	}
}
function easeIn(t) {
 return t*t; 
}
function getDistance(x1, y1, x2, y2) {
	var 	xs = x2 - x1,
		ys = y2 - y1;		
	xs *= xs;
	ys *= ys;
	return Math.sqrt( xs + ys );
};
// move the image where the mouse is
// this function is called by the setInterval command above to run
// at a rate of 30 frames per second
function animateFollower() {
  	$('#follower').css('left', relMouseX);
	$('#follower').css('top', relMouseY);
	$('#follower').css('transition-property', 'left, top');
	$('#follower').css('transition-duration', '10s');
}
function flipFollower() {
	if (relMouseX<followerX){
  		$('#follower').css('transform','scaleX(-1)');
	}else if(relMouseX>followerX){
		$('#follower').css('transform','scaleX(1)');
	}
}
function mapRange(input, imin, imax, omin, omax){
  return omin + ((omax - omin) / (imax - imin)) * (input - imin);
}
function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    if (e.target === dragItem) {
    		active = true;
	}
}

function dragEnd(e) {
    initialX = currentX;
	initialY = currentY;
	active = false;
}

function drag(e) {
	if (active) {
		e.preventDefault();
      
		if (e.type === "touchmove") {
        		currentX = e.touches[0].clientX - initialX;
          	currentY = e.touches[0].clientY - initialY;
    		} else {
          	currentX = e.clientX - initialX;
          	currentY = e.clientY - initialY;
    		}
	    xOffset = currentX;
   		yOffset = currentY;
		mouseX = currentX;
  		mouseY = currentY;
  		relMouseX = mouseX - offset.left;
  		relMouseY = mouseY - offset.top;
    }
}