// this is helper code to get your audio responsive visualizer to look good on a full screen
// to see this in full screen go to file->share>fullscreen


let audioStarted = false; // needed to get it to work in full screen mode
let audioIn; // selecting the right audio interface
let mic; // this is so we can get audio in

// my variable for the image I'm creating
var levelsLow;
var levelsHigh;

var count = 0

function preload(){
  sound = loadSound('drumLoop.mp3');
}

function setup() {

  createCanvas(displayWidth, displayHeight, WEBGL); // important to change your canvas to fit the screen
  
  fft = new p5.FFT();
  mic = new p5.AudioIn(); 
  // do not put mic.start() here. it is in the gotSources function
  mic.getSources(gotSources); // so we can get sound from the audio interface
  // fft.setInput(mic);
  sound.play();
  sound.amp(0.2);
  
  getAudioContext().suspend(); // needed to get it to work in full screen mode

}

function draw() {
  background(255);
  
  let spectrum = fft.analyze();
  
  console.log(spectrum);
  
  if(spectrum[10] > 100){
    levelsLow = spectrum[10];
  }
  
  if(spectrum[70] > 100){
    levelsHigh = spectrum[200];
  }
 
  for (let i=0; i<width; i=i+7){
    line(i-(width/2), -height/2, i-(width/2), height/2);
  }
  
  count++
  
  if(count>100){
    fill(random(0, 255), random(0, 255), random(0, 255))
    count = 0
  }

  push();
  translate(-width/4, 0, 0);
  // rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  torus(levelsLow+ width/100, width*.015);
  pop();
  
  push();
  translate(width/4, 0, 0);
  // rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  torus(levelsHigh+ width/100 , width*.015);
  pop();
  
}

function mousePressed() { // needed to get it to work in full screen mode
    // Start audio on user gesture
    if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
    }
}

function gotSources(deviceList) { // needed to select the default audio interface
  if (deviceList.length > 0) {
    mic.setSource(0);
    let currentSource = deviceList[mic.currentSource];
    console.log('set source to: ' + currentSource.label);
    mic.start(); //it's important that mic start is below the set source code or it will still use the automatically selected one
  }
}
