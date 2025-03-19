let squishSynth, filt, LFOfilt, panner, fmSynth, noise1, noiseEnv, filt1, escapeSynth, missSynth, basicSynth, padSynth, arpSynth, arpPattern, noiseSynth, noiseLoop;;

let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 10;
let textPadding = 15;

let roach;
let squash;
let characters = [];

let clickedOnBug = false;

let spawnInterval = 3; 
let lastSpawnTime = 0;


function preload() {
  roach = loadImage("media/Roach.png");
  fly = loadImage("media/fly.png")
  squash = loadImage("media/Squash.png");
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);
  imageMode(CENTER);
}
function draw() {
  background(220);

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER To Start", width / 2, height / 2);
      break;

    case GameStates.PLAY:
      let currentTime = millis() / 1000; 
      
      if (currentTime - lastSpawnTime > spawnInterval) {
        spawnRoach();
        lastSpawnTime = currentTime;
        
        spawnInterval = max(0.5, spawnInterval * 0.95);
      }

      for (let i = characters.length - 1; i >= 0; i--) {
        let character = characters[i];
        character.update();
        character.draw();

        if (character.isDead && character.animations["squash"].isFinished) {
          characters.splice(i, 1);
          score++;
          spawnRoach(); 
        } else if (!character.isDead && (character.x <= 40 || character.x >= width - 40 || character.y <= 40 || character.y >= height - 40)) {
          escapeSynth.triggerAttackRelease("F#3", 0.2);
          characters.splice(i, 1);
          spawnRoach(); 
        }
      }

      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }
      break;

      case GameStates.END:
        Tone.Transport.stop();
        
        if (arpPattern && arpPattern.state === "started") {
          arpPattern.stop();
        }
        if (noiseLoop && noiseLoop.state === "started") {
          noiseLoop.stop();
        }
      
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2 - 20);
        text("Score: " + score, width / 2, height / 2);
      
        if (score > highScore) highScore = score;
        text("High Score: " + highScore, width / 2, height / 2 + 20);
        text("Press ENTER To Restart", width / 2, height / 2 + 50);
        break;
  }
}

function keyPressed() {
  if (gameState === GameStates.START && keyCode === ENTER) {
    gameState = GameStates.PLAY;
    initAudio();
    resetGame();
  } else if (gameState === GameStates.END && keyCode === ENTER) {
    if (gameState !== GameStates.PLAY) {  
      gameState = GameStates.PLAY;
      initAudio();
      resetGame();
    }
  }
}

function resetGame() {
  score = 0;
  time = 30;
  characters = [];
  spawnInterval = 3;
  lastSpawnTime = millis() / 1000;

  for (let i = 0; i < 2; i++) {  //Roaches on stawn
    spawnRoach();
  }
  arpPattern.stop();
  noiseLoop.stop();
  startBackgroundMusic();
  Tone.Transport.start();
}


function spawnRoach() {
  let roachCharacter = new Character(random(80, width - 80), random(80, height - 80));
  roachCharacter.addAnimation("move", new SpriteAnimation(roach, 2, 2, 15));
  roachCharacter.addAnimation("squash", new SpriteAnimation(squash, 3, 3, 3, true));
  roachCharacter.currentAnimation = "move";
  characters.push(roachCharacter);
}

function initAudio() {
  Tone.start();

  panner = new Tone.AutoPanner({
    frequency: 1,
    depth: 1
  }).toDestination().start();
  
  filt = new Tone.Filter(300, "lowpass", -48).connect(panner);
  basicSynth = new Tone.Synth({
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }
  }).connect(filt);
  
  LFOfilt = new Tone.LFO(1, 200, 2000).start();
  LFOfilt.connect(filt.frequency);
  
  fmSynth = new Tone.FMSynth({
    harmonicity: 1,
    modulationIndex: 10
  }).toDestination();

  squishSynth = new Tone.MembraneSynth({
    pitchDecay: 0.08,
    octaves: 3,
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0,
      release: 0.2
    }
  }).toDestination();

  escapeSynth = new Tone.Synth({
    oscillator: { type: "sawtooth" }, 
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.3 }
  }).toDestination();

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

  missSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).toDestination();

  startBackgroundMusic();
}

function startBackgroundMusic() {

  let padSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 4,
      decay: 2,
      sustain: 0.5,
      release: 6
    }
  }).toDestination();

  let padNotes = ["C4", "E4", "G4", "B4"];
  let padIndex = 0;

  new Tone.Loop(time => {
    padSynth.triggerAttackRelease(padNotes[padIndex % padNotes.length], 6, time);
    padIndex++;
  }, "8s").start(0);

  let arpSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.04,
      decay: 0.2,
      sustain: 0.1,
      release: 0.5
    }
  }).toDestination();

  let arpPattern = new Tone.Pattern((time, note) => {
    arpSynth.triggerAttackRelease(note, "8n", time);
  }, ["C5", "E5", "G5", "B5"], "upDown");

  arpPattern.interval = "8n";
  arpPattern.start(0);

  let noiseSynth = new Tone.NoiseSynth({
    noise: { type: "brown" },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0,
      release: 0.1
    }
  }).toDestination();

  let noiseLoop = new Tone.Loop(time => {
    noiseSynth.triggerAttackRelease("8n", time);
  }, "4n");

  noiseLoop.start(0);

  Tone.Transport.start();
}



function mousePressed() {
 if (gameState === GameStates.PLAY) {
  clickedOnBug = false; 
  for (let i = characters.length - 1; i >= 0; i--) {
    let character = characters[i];
    if (!character.isDead && character.isMouseOver()) {
      character.isDead = true;
      character.currentAnimation = "squash";
      character.animations["squash"].u = 0;
      character.animations["squash"].v = 0;
      character.animations["squash"].isFinished = false;

      let squishNotes = ["I1", "G2", "J1", "G2", "H2", "H4", "H1", "D2"];  
      let randomNote = random(squishNotes);  
      squishSynth.triggerAttackRelease(randomNote, 0.1);
      clickedOnBug = true; 
      break;
    }
  }

  if (!clickedOnBug) {
    missSynth.triggerAttackRelease("8n");
  }
 }
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = "move";
    this.animations = {};
    this.direction = "up";
    this.changeDirectionTimer = 0;
    this.rotation = 0;
    this.isDead = false;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  update() {
    if (!this.isDead) {
      switch (this.direction) {
        case "left":
          this.x -= 2;
          this.rotation = -HALF_PI;
          break;
        case "right":
          this.x += 2;
          this.rotation = HALF_PI;
          break;
        case "up":
          this.y -= 2;
          this.rotation = 0;
          break;
        case "down":
          this.y += 2;
          this.rotation = PI;
          break;
      }

      if (this.x < 40) {
        this.x = 40; 
        this.direction = "right";
      }
      if (this.x > width - 40) {
        this.x = width - 40;
        this.direction = "left";
      }
      if (this.y < 40) {
        this.y = 40;
        this.direction = "down"; 
      }
      if (this.y > height - 40) {
        this.y = height - 40;
        this.direction = "up";
      }
      this.animations[this.currentAnimation].nextFrame();
      
      this.changeDirectionTimer++;
      if (this.changeDirectionTimer > 120) {
        this.pickNewDirection();
        this.changeDirectionTimer = 0;
      }
    } else {
      if (this.currentAnimation === "squash") {
        this.animations["squash"].nextFrame();
      }
    }
  }

  pickNewDirection() {
    let directions = ["left", "right", "up", "down"];
    this.direction = random(directions);
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      animation.draw();
      pop();
    }
  }

  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < 40;
  }
}

class SpriteAnimation {
  constructor(spritesheet, columns, rows, duration, playOnce = false) {
    this.spritesheet = spritesheet;
    this.columns = columns;
    this.rows = rows;
    this.u = 0;
    this.v = 0;
    this.duration = duration;
    this.frameCount = 0;
    this.playOnce = playOnce;
    this.isFinished = false;
  }

  draw() {
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
  }

  nextFrame() {
    if (this.isFinished) return;

    this.frameCount++;

    if (this.frameCount % this.duration === 0) {
      this.u++;
      if (this.u >= this.columns) {
        this.u = 0;
        this.v++;
        if (this.v >= this.rows) {
          this.v = 0;
          if (this.playOnce) {
            this.isFinished = true;
          }
        }
      }
    }
  }
}
