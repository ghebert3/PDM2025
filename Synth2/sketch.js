let synth1, filt, rev, polySynth, noise1, ampEnv1, filt1, fmSynth;
let modIndexSlider, harmonicitySlider;
let activeKeys = new Set(); 

let keyNotes1 = {
  'a': 'B4',
  's': 'B3',
  'd': 'C4',
  'f': 'D5',
  'g': 'E4',
  'h': 'G4',
  'j': 'A4',
  'k': 'B4'
}

function setup() {
  createCanvas(400, 400);

  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);

  synth1 = new Tone.Synth({
    envelope: {
      attack: 0.1, 
      decay: 0.2,
      sustain: 0.9,
      release: 0.3
    }
  }).connect(rev);
  
  synth1.portamento.value = 0.5;

  fmSynth = new Tone.PolySynth(Tone.FMSynth).connect(rev);
  fmSynth.set({
    harmonicity: 1.5,
    modulationIndex: 10,
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.7,
      release: 0.5
    }
  });

  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 0.5
  }).toDestination();

  filt1 = new Tone.Filter(1000, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(ampEnv1);

  modIndexSlider = createSlider(0, 100, 10, 1);
  modIndexSlider.position(10, height - 60);
  modIndexSlider.style('width', '150px');

  harmonicitySlider = createSlider(0.5, 10, 1.5, 0.1);
  harmonicitySlider.position(10, height - 30);
  harmonicitySlider.style('width', '150px');
}

function draw() {
  background(220);
  
  fmSynth.set({
    modulationIndex: modIndexSlider.value(),
    harmonicity: harmonicitySlider.value()
  });

  text("Mod Index: " + modIndexSlider.value(), 230, height - 50);
  text("Harmonicity: " + harmonicitySlider.value(), 240, height - 20);
  
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Press A S D F G H J K", width / 2, height / 2);
}

function keyPressed() {
  let pitch1 = keyNotes1[key];

  if (pitch1 && !activeKeys.has(key)) {
    activeKeys.add(key);
    fmSynth.triggerAttack(pitch1);
  } else if (key === "z") {
    ampEnv1.triggerAttackRelease(1);
  }
}

function keyReleased() {
  let pitch1 = keyNotes1[key];

  if (pitch1 && activeKeys.has(key)) {
    activeKeys.delete(key);
    fmSynth.triggerRelease(pitch1);
  }
}
