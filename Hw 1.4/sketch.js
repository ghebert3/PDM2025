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
      for (let i = characters.length - 1; i >= 0; i--) {
        let character = characters[i];
        character.update();
        character.draw();

        if (character.isDead && character.animations["squash"].isFinished) {
          characters.splice(i, 1);
          score++;
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
    resetGame();
  } else if (gameState === GameStates.END && keyCode === ENTER) {
    gameState = GameStates.PLAY;
    resetGame();
  }
}

function resetGame() {
  score = 0;
  time = 30;
  characters = [];

  for (let i = 0; i < 10; i++) {  //Amount of roaches on spawn
    spawnRoach();
  }
}


function spawnRoach() {
  let roachCharacter = new Character(random(80, width - 80), random(80, height - 80));
  roachCharacter.addAnimation("move", new SpriteAnimation(roach, 2, 2, 15));
  roachCharacter.addAnimation("squash", new SpriteAnimation(squash, 3, 3, 3, true));
  roachCharacter.currentAnimation = "move";
  characters.push(roachCharacter);
}

function mousePressed() {
  for (let i = characters.length - 1; i >= 0; i--) {
    let character = characters[i];
    if (!character.isDead && character.isMouseOver()) {
      character.isDead = true;
      character.currentAnimation = "squash";
      character.animations["squash"].u = 0;
      character.animations["squash"].v = 0;
      character.animations["squash"].isFinished = false;
      break; 
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
