function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES)
  noStroke()
}

function draw() {
  background(150,255,0);
  
  //pac
  fill(50, 80, 300);
  arc(180, 500, 80, 80, 20, 300, PIE);

  fill(400, 250, 300);
  rect(285, 500, 80, 50);
  arc(325, 500, 81, 81, PI*57, 0);

 //eyes
  fill(0, 0, 200)
  ellipse(300, 500, 20, 30);
  ellipse(350, 500, 20, 30);

  //eyeballs
  fill(200, 70, 200);
  ellipse(300, 500, 15, 15);
  ellipse(350, 500, 15, 15);
  
}