let ninja;
let robot;
let monkey;
let characters = []; // Array to hold all characters

function preload() {
  ninja = loadImage("media/Ninja.png");
  robot = loadImage("media/Robot.png");
  monkey = loadImage("media/Monkey.png"); // Load the monkey sprite
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Ninja
  let ninjaCharacter = new Character(random(80, width - 80), random(80, height - 80));
  ninjaCharacter.addAnimation("right", new SpriteAnimation(ninja, 1, 0, 5));
  ninjaCharacter.addAnimation("left", new SpriteAnimation(ninja, 1, 0, 5));
  ninjaCharacter.addAnimation("stand", new SpriteAnimation(ninja, 0, 0, 1));
  ninjaCharacter.currentAnimation = "stand";

  // Robot
  let robotCharacter = new Character(random(80, width - 80), random(80, height - 80));
  robotCharacter.addAnimation("right", new SpriteAnimation(robot, 1, 0, 5));
  robotCharacter.addAnimation("left", new SpriteAnimation(robot, 1, 0, 5));
  robotCharacter.addAnimation("stand", new SpriteAnimation(robot, 0, 0, 1));
  robotCharacter.currentAnimation = "stand";

  // Monkey
  let monkeyCharacter = new Character(random(80, width - 80), random(80, height - 80));
  monkeyCharacter.addAnimation("right", new SpriteAnimation(monkey, 1, 0, 5));
  monkeyCharacter.addAnimation("left", new SpriteAnimation(monkey, 1, 0, 5));
  monkeyCharacter.addAnimation("stand", new SpriteAnimation(monkey, 0, 0, 1));
  monkeyCharacter.currentAnimation = "stand";

  characters.push(ninjaCharacter, robotCharacter, monkeyCharacter);
}

function draw() {
  background(220);

  for (let character of characters) {
    character.draw();
  }
}

function keyPressed() {
  for (let character of characters) {
    character.keyPressed();
  }
}

function keyReleased() {
  for (let character of characters) {
    character.keyReleased();
  }
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "left":
          this.x -= 2;
          break;
        case "right":
          this.x += 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case LEFT_ARROW:
        this.currentAnimation = "left";
        this.animations[this.currentAnimation].flipped = true;
        break;
      case RIGHT_ARROW:
        this.currentAnimation = "right";
        this.animations[this.currentAnimation].flipped = false;
        break;
    }
  }

  keyReleased() {
    this.animations["stand"].flipped = this.animations[this.currentAnimation].flipped; // Preserve the direction
    this.currentAnimation = "stand";
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = this.flipped ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 6 === 0) this.u++;

    if (this.u === this.startU + this.duration) this.u = this.startU;
  }
}
