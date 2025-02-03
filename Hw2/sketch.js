let colors = [
  'red', 'orange', 'yellow', [0, 250, 60], 'skyblue',
  'blue', 'magenta', [101, 67, 32], 'white', 'black' ];

  let selectedColor = 'black';

function setup() {
  createCanvas(2560, 1440);
  background(220);
}

function draw() {
 drawPalette();

 if (mouseIsPressed && mouseX > 60) {
  stroke(selectedColor);
  strokeWeight(5);
  line(lastX, lastY, mouseX, mouseY);
}

function drawPalette() {
  fill('red')
  stroke('white')
  strokeWeight(2)
  square(0, 50, 60)

  fill('orange')
  square(0, 110, 60)

  fill('yellow')
  square(0, 170, 60)

  fill(0, 250, 60)
  square(0, 230, 60)

  fill(135,206,250)
  square(0, 290, 60)

  fill('blue')
  square(0, 350, 60)

  fill('magenta');
  square(0, 410, 60);

  fill(101, 67, 32); 
  square(0, 470, 60);

  fill('white'); 
  square(0, 530, 60);

  fill('black'); 
  square(0, 590, 60);
}

lastX = mouseX;
lastY = mouseY;
}

function mousePressed() {
  for (let i = 0; i < colors.length; i++) {
    let y = 50 + i * 60;
    if (mouseX >= 0 && mouseX <= 60 && mouseY >= y && mouseY <= y + 60) {
      selectedColor = colors[i]; 
      return;
  }
 }
}
