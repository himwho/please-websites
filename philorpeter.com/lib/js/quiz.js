const data = {
  answers: {
    "Phil": ['b0', 'b1', 'b2', 'b3', 'b4'],
    "Peter":['a0', 'a1', 'a2', 'a3', 'a4']
  }
};
const quiz=document.querySelector("#quiz");
const slides=document.querySelectorAll(".slide");
const score={
  correct:0,
  incorrect:0,
  total:0
}

var currentSlidePlayer;

function reset() {
  document.querySelector("#start").classList.add("hidden");
  document.querySelector("#end").classList.add("hidden");
  document.querySelector("#questions").innerHTML=quizQuestionSetup();
  document.querySelector("#questions").classList.remove("hidden");
}

function updateScore(correctorno){
  if(correctorno) {
    score.correct++
  } else {
    score.incorrect++
  }
  score.total++;
}

function check(opt,q) {
  updateScore(feedback(opt,q));
}

function feedback(opt,q) {
  const correctorno=data.answers[opt].find(a =>String(a).includes(q)) !==undefined
  if(correctorno) {
    document.querySelector("#feedback").innerHTML="<span>correct</span>"
  } else { 
    document.querySelector("#feedback").innerHTML="<span>wrong</span>"
  }
  document.querySelector("#feedback").classList.add("anim");
  return correctorno;
}

function nextslide(){
  num=Number(document.querySelector("#questions .slide:not(.hidden)").id.split("slide")[1]);
  const slides = document.querySelectorAll("#questions .slide")
  for(const slide of slides) {
      slide.classList.add("hidden");
  }
  const newSlide=document.querySelector(`#slide${(num+1)}`)
  if(newSlide){
    newSlide.classList.remove("hidden");
    newSlide.focus();
    var audioFile = 'res/aud/'+newSlide.getAttribute("data-internalid")+'.mp3';
    var currentSlidePlayer = new Audio(audioFile);
    currentSlidePlayer.play();
  } else {
    quizCompleted();
  }
}

function quizCompleted() {
  document.querySelector("#questions").classList.add("hidden")
  document.querySelector("#end").classList.remove("hidden")
  document.querySelector("#end .detail").innerHTML=`You answered ${score.correct} out of ${score.total} questions correctly`
}

function setupQuiz() {
  quiz.innerHTML+=`<div id="start">
    <div class="detail">Press the Start button to begin figuring out who is who...</div>
    <div class="circle"></div>
    <button id="startBtn" onclick="reset()">Start</button>
  <div>`
  quizQuestionSetup();
  quiz.innerHTML+=`<div id="questions" class="hidden">
  ${quizQuestionSetup()}</div>`

  quiz.innerHTML+=` <div id="end" class="hidden">
  <div class="circle"><span>wow!</span></div>
  <div class="detail"></div>
    <button id="retryBtn" onclick="reset()">Retry</button>
  <div>`
  quiz.innerHTML+=`<div id="feedback" aria-live="polite"><div>`
 document.querySelector("#feedback").addEventListener("animationend", function(e) {
    animEnd(e)
  }, false);
  document.addEventListener("keydown", (e) => {
    if(!document.querySelector("#quiz").classList.contains("hidden") && !document.querySelector("#questions").classList.contains("animCircLeft") && !document.querySelector("#questions").classList.contains("animCircRight")) {
      switch(e.keyCode){
        case 37:
          document.querySelector(".slide:not(.hidden) .optBtn:nth-of-type(1)").click();
          break;
        case 39:
          document.querySelector(".slide:not(.hidden) .optBtn:nth-of-type(2)").click();
          break;
        default:
          return;
          break;
      }
    }  
  });
}
function animEnd(e){
  if(e.animationName==="feedbackAnimIn"){
    if(e.target.parentNode.classList.contains("anim")){
      e.target.parentNode.classList.add("animout");
    }
  }
 if(e.animationName==="feedbackAnimOut"){ 
    if(e.target.parentNode.classList.contains("animout")) {
      e.target.parentNode.classList.remove("animout");
      e.target.parentNode.classList.remove("anim");
      nextslide();
      document.querySelector("#questions").classList.remove("animCircRight");
      document.querySelector("#questions").classList.remove("animCircLeft");
      document.querySelector("#questions").classList.add("dropin");
    }
  }
}

function quizQuestionSetup(){
  score.correct=0;
  score.incorrect=0;
  score.total=0;
  const sortedQs=shuffle(allQs);
  questionHtml="";
  for(const q in sortedQs) {
    questionHtml+=`<div id="slide${q}" data-internalid="${sortedQs[q][0]}" tabindex="0" class="slide ${(Number(q)===0) ? '' : 'hidden'}">
    <fieldset>
      <legend class="lgnd"><span><img src="res/img/${sortedQs[q][0]}.png"></span></legend>
      <button class="optBtn" onclick="check('${allAs[0]}','${sortedQs[q][0]}');document.querySelector('#questions').classList.add('animCircLeft');" data-opt="${allAs[0]}" data-q="${sortedQs[q][0]}">${allAs[0]}</button>
      <button class="optBtn" onclick="check('${allAs[1]}','${sortedQs[q][0]}');document.querySelector('#questions').classList.add('animCircRight');" data-opt="${allAs[1]}" data-q="${sortedQs[q][0]}">${allAs[1]}</button>
    </fieldset>
  </div>`
  }
  return questionHtml;
}

function shuffle(arr) {
  let ci = arr.length,  ri;
  while (ci != 0) {
    ri = Math.floor(Math.random() * ci);
    ci--;
    [arr[ci], arr[ri]] = [
      arr[ri], arr[ci]];
  }
  return arr;
}

let movingCirc=false;
let moveX=0;

function handleStart(e) {
  if(e.target.classList.contains("lgnd")) {
    e.target.classList.add("moving");
    movingCirc=true;  
  }
}

function handleTouchEnd(e) {
  if(movingCirc) {
    handleEnd(moveX,e.target);
  }
}

function handleMouseEnd(e) {
  if(movingCirc) {
    handleEnd(e.pageX,e.target);
  }
}

function handleTouchCancel(e) {
  if(movingCirc) {
    handleEnd(moveX,e.target);
  }
}

function handleEnd(x, el) {
    if(el.classList.contains("lgnd")) {
    el.classList.remove("moving");
    }
    movingCirc=false;
  if(x<document.querySelector(".slide:not(.hidden)").offsetWidth/2) {
    document.querySelector(".slide:not(.hidden) .optBtn:nth-of-type(1)").click()
  } else {
    document.querySelector(".slide:not(.hidden) .optBtn:nth-of-type(2)").click()
  }
}

function handleMouseMove(e) {
  if(movingCirc) {
    handleMove(e.pageX);
  }
}

function handleTouchMove(e) {
  if(movingCirc) {
    moveX=e.touches[0].pageX;
    handleMove(moveX)
  }
}

function handleMove(x) {
  if(movingCirc) {
    const elSlide=document.querySelector(".slide:not(.hidden)");
  const el=elSlide.querySelector("legend");
    if(x<10 || x>(elSlide.offsetWidth-10)){
       handleEnd(x, el)
       }
    el.style.left=x+"px";
  }
}

const allQs=[];
const allAs=[];
(function(){
  for(const answer in data.answers){
    allAs.push(answer);
    for (const qs of data.answers[answer]){
      allQs.push([qs, answer])
    }
  }
  setupQuiz();
  
  quiz.addEventListener('mousedown', handleStart);
  quiz.addEventListener('mouseup', handleMouseEnd);
  quiz.addEventListener('mousemove', handleMouseMove);
  quiz.addEventListener('touchstart', handleStart);
  quiz.addEventListener('touchend', handleTouchEnd);
  quiz.addEventListener('touchcancel', handleTouchCancel);
  quiz.addEventListener('touchmove', handleTouchMove);
})();