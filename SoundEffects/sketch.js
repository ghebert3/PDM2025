let basicSynth, filt, LFOfilt, panner, fmSynth, values, values1, noise1, noiseEnv, filt1;
let started = false;
let ufo, ufoX, ufoY, ufoSize;

function preload() {
  ufo = loadImage("media/UFO.png");
}

function setup() {
  createCanvas(400, 400);
  ufoX = width / 2;
  ufoY = height / 2;
  ufoSize = 100; 
}

function draw() {
  background(220);
  
  if (!started) {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("Spam The Mouse Button To Start ", width / 2, height / 2);
  } else {
    imageMode(CENTER);
    image(ufo, ufoX, ufoY, ufoSize, ufoSize); 
  }
}

function mousePressed() {
  if (!started) {
    started = true;
    initAudio(); 
  }
}

function initAudio() {
  Tone.start();
  
  panner = new Tone.AutoPanner({
    frequency: 1,
    depth: 1
  }).toDestination().start();
  
  filt = new Tone.Filter(300, "lowpass", -48).connect(panner);
  filt = new Tone.Filter(300, "lowpass", -48).connect(panner);
  basicSynth = new Tone.Synth({
    envelope: {
      attack: 0.5,
      decay: 0.2,
      sustain: 0.7,
      release: 1
    }
  }).connect(filt);
  LFOfilt = new Tone.LFO(1, 200, 2000).start();
  LFOfilt.connect(filt.frequency);
  fmSynth = new Tone.FMSynth({
    harmonicity: 1,
    modulationIndex: 10
  }).toDestination();
  
  values = new Float32Array([1, 0.02, 0.3, 15, 15, 0.3, 1]);
  
  filt1 = new Tone.AutoFilter({
    frequency: 0.1,
    depth: 0.3,
    baseFrequency: 500, 
    octaves: 4
  }).toDestination().start();
  
  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 3,
    decay: 0.1,
    sustain: 1,
    release: 1
  }).connect(filt1);
  
  noise1 = new Tone.Noise().connect(noiseEnv).start();
  
  values1 = new Float32Array([-96, -30, -12, 0, -12, 0, 0, -6, -12, -30, -96]);
}

function mouseClicked() {
  if (started) {
    ufoX = random(50, width - 50);
    ufoY = random(50, height - 50);
    
    ufoSize = random(50, 150);
    
    basicSynth.triggerAttackRelease(random(200, 400), 3);
    basicSynth.frequency.rampTo(random(400, 800), 3);
    LFOfilt.frequency.value = random(0.1, 5);
    LFOfilt.frequency.rampTo(random(20, 60), 3);
    fmSynth.harmonicity.value = 1;
    fmSynth.triggerAttackRelease(random(200, 400), 5);
    fmSynth.harmonicity.setValueAtTime(random(0.1, 0.5), Tone.now() + 2.5);
    fmSynth.harmonicity.setValueCurveAtTime(values, Tone.now(), 5);
  }
}

