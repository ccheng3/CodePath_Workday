// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const numButtons = 4;

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  generateNewGamePattern()
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  // stop the game, hide the stop button and show 
  // the start button
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
// changed frequencies to A flat, B flat, C, D flat (A flat major first four)
// I didn't think the dominant 7th chord sounded that great.
const freqMap = {
  1: 207.65,
  2: 233.08,
  3: 261.6,
  4: 277.18
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("btn"+btn).classList.add("lit");
}
function clearButton(btn){
  document.getElementById("btn"+btn).classList.remove("lit");
}

function playSingleClue(btn){
  if(gamePlaying){
    console.log(btn);
    presentImage(btn);
    setTimeout(lightButton(btn), clueHoldTime);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0; i <= progress; i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. Congratulations. You beat the game!");
}

function displayImage(btn) {
  document.getElementById("img" + btn).classList.remove("hidden");
}

function clearImage(btn) {
  document.getElementById("img" + btn).classList.add("hidden");
}

function presentImage(btn) {
  displayImage(btn);
  setTimeout(function() {
    clearImage(btn);
  }, 700);
}

function guess(btn){
  presentImage(btn);
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  // add game logic here
  // check if the correct button was pressed
  if (pattern[guessCounter] === btn) {
    // check if the turn is over
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        winGame();
      }
      else {
        progress += 1;
        playClueSequence();
      }
    }
    else {
      guessCounter += 1;
    }
  }
  else {
    loseGame();
  }
}

function generateNewGamePattern() {
  for (let i = 0; i < pattern.length; ++i) {
    pattern[i] = Math.floor(Math.random() * (numButtons - 1) + 1)
  }
}